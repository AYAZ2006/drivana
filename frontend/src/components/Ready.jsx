  import React, {useEffect, useState} from 'react'
  import {MapContainer, TileLayer, Marker, Polyline, useMap} from 'react-leaflet'
  import 'leaflet/dist/leaflet.css'
  import L from 'leaflet'
  import axios from 'axios'
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({iconUrl:'https://cdn-icons-png.flaticon.com/128/13223/13223499.png',shadowUrl:'https://cdn-icons-png.flaticon.com/128/13223/13223499.png'})
  const pickupIcon = new L.Icon({iconUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png',iconSize: [30, 30],iconAnchor: [15, 30],popupAnchor: [0, -30]})
  const dropoffIcon = new L.Icon({iconUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png',iconSize: [30, 30],iconAnchor: [15, 30],popupAnchor: [0, -30]})
  function Recenter({coords}){
    const map=useMap()
    useEffect(()=>{
      if(coords){
        map.setView(coords, 13)
      }
    },[coords])
    return null
  }
  function Ready({onlyMap=false}){
    const[pickupCoords,setPickupCoords]=useState(null)
    const[dropoffCoords,setDropoffCoords]=useState(null)
    const[routeCoords,setRouteCoords]=useState([])
    const[userCoords,setUserCoords]=useState(null)
    const[req,setReq]=useState([])
    const[on,setOn]=useState(false)
    const[cl,setCl]=useState(null)
    const[acceptedRide,setAcceptedRide]=useState(null)
    const username=localStorage.getItem('username')
    const[reachedPickup,setReachedPickup]=useState(false)
    const[reachedDestiny,setReachedDestiny]=useState(false)
    useEffect(()=>{
      const watch=navigator.geolocation.watchPosition(
        pos=>{const{latitude,longitude}=pos.coords;setUserCoords([latitude,longitude])},
        () => alert('Location access denied'),
        {enableHighAccuracy: true}
      )
      return()=>navigator.geolocation.clearWatch(watch)
    },[])
    useEffect(()=>{
      const fetchReq=async()=>{
        try{
          const response=await axios.get('https://drivana-backend.vercel.app/api/drive/')
          setReq(response.data)
        }
        catch{
          alert('no drivers found!')
        }
      }
      if (on) fetchReq()
    },[on])
    const geocode=async place=>{
      const res=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`)
      return await res.json()
    }
    const fetchRoute=async(pickup,dropoff)=>{
    try {
      let pickupLat,pickupLon,dropoffLat,dropoffLon
      if (Array.isArray(pickup)){
        [pickupLat,pickupLon]=pickup
      } else {
        const pickupRes=await geocode(pickup)
        if (!pickupRes[0]) throw new Error('Invalid pickup location')
        pickupLat=parseFloat(pickupRes[0].lat)
        pickupLon=parseFloat(pickupRes[0].lon)
      }
      if (Array.isArray(dropoff)){
        [dropoffLat,dropoffLon]=dropoff
      } else {
        const dropoffRes=await geocode(dropoff)
        if (!dropoffRes[0]) throw new Error('Invalid dropoff location')
        dropoffLat=parseFloat(dropoffRes[0].lat)
        dropoffLon=parseFloat(dropoffRes[0].lon)
      }
      setPickupCoords([pickupLat,pickupLon])
      setDropoffCoords([dropoffLat,dropoffLon])
      const res=await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {method: 'POST',headers: {Authorization: '5b3ce3597851110001cf6248b5753e1881984b7c875a1ab843598fb8','Content-Type': 'application/json'},body: JSON.stringify({coordinates: [[pickupLon, pickupLat],[dropoffLon, dropoffLat]]})})
      const json=await res.json()
      const coords=json.features[0].geometry.coordinates.map(([lon, lat])=>[lat,lon])
      setRouteCoords(coords)
    } catch(err){
      alert('Failed to load route: ' + err.message)
    }
  }
    function ZoomControl(){
      const map=useMap()
      useEffect(()=>{
        const zoom=L.control.zoom({ position: 'topright' })
        zoom.addTo(map)
        return ()=>{
          zoom.remove()
        }
      }, [map])
      return null
    }
    return (
      <div className='bg-white h-185'>
        <div className='h-100 bg-black'>
          <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{height: '100%', width: '100%'}} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <ZoomControl/>
            {userCoords && (
              <>
                <Marker position={userCoords}/>
                <Recenter coords={userCoords}/>
              </>
            )}
            {pickupCoords && <Marker position={pickupCoords} icon={pickupIcon}/>}
            {dropoffCoords && <Marker position={dropoffCoords} icon={dropoffIcon}/>}
            {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue"/>}
          </MapContainer>
        </div>
        {!onlyMap && (
          <div>
            <button className='rounded-full h-20 w-20 bg-black text-white ml-36 mt-5 text-2xl font-bold' onClick={()=>setOn(!on)}>{on?'STOP':'GO'}</button>
            <div className='h-60 rounded-tl-[10px] rounded-tr-[10px]'>
              <h1 className='text-2xl flex justify-center'>You're Currently {on?'online':'offline'}</h1>
              {!on && <div className='border-1 rounded-2xl mx-2 mt-5 bg-[#ef6161]' onClick={()=>setOn(true)}>
                <h1 className='ml-2'>Opportunity</h1>
                <h1 className='ml-2 text-2xl'>Peak flight hours at HYD✈️</h1>
                <h1 className='font-bold ml-2'>Click here</h1>
              </div>}
              {on && req.map((req, index) => (
                <div key={index} onClick={()=>setCl(cl===index?null:index)} className={`bg-gray-100 rounded-xl p-2 m-2 shadow transform transition-transform duration-300 cursor-pointer ${cl === index ? 'scale-105 h-auto' : 'h-10 overflow-hidden'}`}>
                  <h2 className="font-bold">User: {req.username}</h2>
                  <p><strong>Pickup:</strong> {req.details.pickup}</p>
                  <p><strong>Dropoff:</strong> {req.details.dropoff}</p>
                  <p><strong>Distance:</strong> {req.details.distance} km</p>
                  <p><strong>Price:</strong> ₹{req.details.price}</p>
                  <p><strong>Ride Type:</strong> {req.details.ride_type}</p>
                  <button className='rounded-full border-1 mt-5 bg-black text-white w-20 h-10' onClick={async (e) => { e.stopPropagation(); try { const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true })); const lat = pos.coords.latitude, lng = pos.coords.longitude; await fetchRoute(`${userCoords[0]},${userCoords[1]}`, req.details.pickup, false, 'green'); setAcceptedRide(req); const driverUsername = localStorage.getItem("username"); const detailsRes = await fetch(`https://drivana-backend.vercel.app/api/${driverUsername}/details/`); const userDetails = await detailsRes.json(); const phone = userDetails?.[0]?.details?.[0]; const res = await fetch("https://drivana-backend.vercel.app/api/drive/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: req.id, accepted_by: driverUsername, driver_latitude: lat, driver_longitude: lng, phone }) }); if (!res.ok) throw new Error("Failed to record accepted ride"); setReq([]); } catch (err) { console.error("Error:", err); alert("Location access is required to accept the ride."); } }}>Accept</button>
                  <button className='rounded-full h-10 ml-30 w-10 border-1 font-bold'>X</button>
                </div>
              ))}
              {on && acceptedRide && !reachedPickup && (
                <div>
                  <button className='rounded-full border-1 bg-black text-white h-10 w-40 mt-5 ml-25' onClick={async () => { if (!acceptedRide) return; const pickup=acceptedRide.details.pickup;const dropoff=acceptedRide.details.dropoff;if (!pickup || !dropoff) return;await fetchRoute(pickup,dropoff,false,'blue');setReachedPickup(true);}}>Reached at pickup</button>
                </div>
              )}
              {on && acceptedRide && reachedPickup && !reachedDestiny && (
                <div>
                  <button className='rounded-full border-1 bg-black text-white h-10 w-40 mt-5 ml-25' onClick={async()=>{if(!acceptedRide?.id)return;try{await fetch('https://drivana-backend.vercel.app/api/drive/',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:acceptedRide.id})});const orderPayload={pickup:acceptedRide.details.pickup,dropoff:acceptedRide.details.dropoff,ride_type:acceptedRide.details.ride_type,quantity:parseInt(acceptedRide.details.ride_type?.match(/\d+/)?.[0])||1,total_price:parseFloat(acceptedRide.details.price)};await fetch(`https://drivana-backend.vercel.app/api/${acceptedRide.username}/rides/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(orderPayload)});}catch(e){console.error(e)}setReachedDestiny(true);setReq([]);}}>Reached Destiny</button>
                </div>
              )}
              {on && acceptedRide && reachedPickup && reachedDestiny && (
                <div className="mt-5 mx-10 bg-green-100 p-4 rounded-xl shadow">
                  <p className="text-xl font-semibold text-green-800">Ride Completed! Total Fare: ₹{acceptedRide.details.price}</p>
                  <button className='border-1 rounded-full bg-black text-white w-60 h-10 mt-5'  onClick={()=>{setAcceptedRide(null);setReachedPickup(false);setReachedDestiny(false);}}>Continue with other rides{'>>>'}</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  export default Ready
