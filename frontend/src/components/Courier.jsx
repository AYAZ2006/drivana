import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png',
  shadowUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png'
})
const pickupIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })
const dropoffIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] })

function Recenter({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords) map.setView(coords, 13)
  }, [coords])
  return null
}

function Courier() {
  const[pickup,setPickup]=useState('')
  const[dropoff,setDropoff]=useState('')
  const[pickupCoords,setPickupCoords]=useState(null)
  const[dropoffCoords,setDropoffCoords]=useState(null)
  const[routeCoords,setRouteCoords]=useState([])
  const[userCoords,setUserCoords]=useState(null)
  const[pickupSuggestions,setPickupSuggestions]=useState([])
  const[dropoffSuggestions,setDropoffSuggestions]=useState([])
  const[ride,setRide]=useState(false)
  const[distance,setDistance]=useState(null)
  const isFormComplete=pickup && dropoff
  const navigate=useNavigate()
  const username=localStorage.getItem('username')

  useEffect(()=>{
    const watch=navigator.geolocation.watchPosition(
      (pos)=>setUserCoords([pos.coords.latitude, pos.coords.longitude]),
      ()=>alert('oops no internet connection!!'),
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watch)
  }, [])

  const geocode=async(place)=>{
    const res=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`)
    return await res.json()
  }
  const handleDrive=async(rate,rideType)=>{
    try {
      const price = (distance * rate).toFixed(2)
      const payload = {
        username,
        details: { pickup, dropoff, price, distance, ride_type: rideType }
      }
      const response = await axios.post(`https://drivana-backend.vercel.app/api/drive/`, payload)
      const rideId = response.data.id
      if (rideId) localStorage.setItem('currentRideId', rideId)
      navigate('/find')
    } catch {
      alert('Unable to book a ride at the moment')
    }
  }

  const handlePickupChange = async (e) => {
    setPickup(e.target.value)
    if (e.target.value.length > 3) setPickupSuggestions(await geocode(e.target.value))
    else setPickupSuggestions([])
  }

  const handleDropoffChange = async (e) => {
    setDropoff(e.target.value)
    if (e.target.value.length > 3) setDropoffSuggestions(await geocode(e.target.value))
    else setDropoffSuggestions([])
  }

  const selectPickup = (address) => {
    setPickup(address)
    setPickupSuggestions([])
  }

  const selectDropoff = (address) => {
    setDropoff(address)
    setDropoffSuggestions([])
  }

  const fetchRoute = async () => {
    try {
      const pickupRes = await geocode(pickup)
      const dropoffRes = await geocode(dropoff)
      const pickupLat = parseFloat(pickupRes[0].lat)
      const pickupLon = parseFloat(pickupRes[0].lon)
      const dropoffLat = parseFloat(dropoffRes[0].lat)
      const dropoffLon = parseFloat(dropoffRes[0].lon)
      setPickupCoords([pickupLat, pickupLon])
      setDropoffCoords([dropoffLat, dropoffLon])
      const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          Authorization: '5b3ce3597851110001cf6248b5753e1881984b7c875a1ab843598fb8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coordinates: [[pickupLon, pickupLat], [dropoffLon, dropoffLat]] })
      })
      const json = await res.json()
      const coords = json.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon])
      setRouteCoords(coords)
      const meters = json.features[0].properties.summary.distance
      setDistance((meters / 1000).toFixed(2))
    } catch (err) {
      alert('Failed to load route: ' + err.message)
    }
  }

  const handleTime = (minutes) => {
    const now = new Date()
    return new Date(now.getTime() + minutes * 60000).toLocaleTimeString()
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="h-[60vh]">
        <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userCoords && <><Marker position={userCoords} /><Recenter coords={userCoords} /></>}
          {pickupCoords && <Marker position={pickupCoords} icon={pickupIcon} />}
          {dropoffCoords && <Marker position={dropoffCoords} icon={dropoffIcon} />}
          {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
        </MapContainer>
      </div>
      <div className="flex-1 overflow-y-auto bg-black text-white p-4 space-y-4">
        <input placeholder="Pickup location" value={pickup} onChange={handlePickupChange} className="border border-gray-400 rounded-3xl bg-white text-black h-10 px-4" />
        {pickupSuggestions.map((sug, idx) => (
          <div key={idx} onClick={() => selectPickup(sug.display_name)} className="border p-2 rounded bg-white text-black cursor-pointer hover:bg-gray-100">
            {sug.display_name}
          </div>
        ))}
        <input placeholder="Dropoff location" value={dropoff} onChange={handleDropoffChange} className="border border-gray-400 rounded-3xl bg-white text-black h-10 px-4" />
        {dropoffSuggestions.map((sug, idx) => (
          <div key={idx} onClick={() => selectDropoff(sug.display_name)} className="border p-2 rounded bg-white text-black cursor-pointer hover:bg-gray-100">
            {sug.display_name}
          </div>
        ))}
        <div className="flex gap-4">
          <button className="border rounded-3xl bg-white text-black text-xl px-4 py-2 w-full" onClick={fetchRoute}>Book a ride</button>
          <button onClick={() => setRide((prev) => !prev)} disabled={!isFormComplete} className={`border rounded-3xl text-xl px-4 py-2 w-full ${!isFormComplete ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>Search a ride</button>
        </div>
        {distance && <p className="text-lg mt-2">Distance: {distance} km</p>}
        {ride && (
          <motion.div className="mt-6 space-y-4">
            <strong className="text-lg">Choose a ride</strong>
            {[{ title: 'Bike', img: 'https://cdn-icons-png.flaticon.com/128/26/26969.png', time: 5, rate: 9.3, desc: 'Quick and efficient for light goods' }, { title: 'Mini Truck', img: 'https://cdn-icons-png.flaticon.com/128/6643/6643490.png', time: 8, rate: 18, desc: 'For medium-sized deliveries' }, { title: 'Mini XL', img: 'https://cdn-icons-png.flaticon.com/128/11174/11174268.png', time: 12, rate: 28, desc: 'For bulky and heavy transport' }].map((rideOption, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 bg-white text-black" onClick={() => handleDrive(rideOption.rate, rideOption.title)}>
                <img src={rideOption.img} className="h-16" />
                <div className="flex-1">
                  <p className="text-lg font-semibold">{rideOption.title}</p>
                  <p className="text-sm text-gray-600">{rideOption.time} mins away. {handleTime(rideOption.time)}</p>
                  <p className="text-sm">{rideOption.desc}</p>
                </div>
                <strong className="text-lg">₹{(distance * rideOption.rate).toFixed(2)}</strong>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Courier
