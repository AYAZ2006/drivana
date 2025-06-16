import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png',
  shadowUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png'
})

const pickupIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
})

const dropoffIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/13223/13223499.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
})

function Recenter({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords) {
      map.setView(coords, 13)
    }
  }, [coords])
  return null
}

function ZoomControl() {
  const map = useMap()
  useEffect(() => {
    const zoom = L.control.zoom({ position: 'topright' })
    zoom.addTo(map)
    return () => zoom.remove()
  }, [map])
  return null
}

function MapOnly() {
  const [pickupCoords, setPickupCoords] = useState(null)
  const [dropoffCoords, setDropoffCoords] = useState(null)
  const [routeCoords, setRouteCoords] = useState([])
  const [userCoords, setUserCoords] = useState(null)

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        setUserCoords([latitude, longitude])
      },
      () => alert('Location access denied'),
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watch)
  }, [])

  const geocode = async (place) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`)
    return await res.json()
  }

  const fetchRoute = async (pickup, dropoff) => {
    try {
      let pickupLat, pickupLon, dropoffLat, dropoffLon

      if (Array.isArray(pickup)) {
        [pickupLat, pickupLon] = pickup
      } else {
        const pickupRes = await geocode(pickup)
        if (!pickupRes[0]) throw new Error('Invalid pickup location')
        pickupLat = parseFloat(pickupRes[0].lat)
        pickupLon = parseFloat(pickupRes[0].lon)
      }

      if (Array.isArray(dropoff)) {
        [dropoffLat, dropoffLon] = dropoff
      } else {
        const dropoffRes = await geocode(dropoff)
        if (!dropoffRes[0]) throw new Error('Invalid dropoff location')
        dropoffLat = parseFloat(dropoffRes[0].lat)
        dropoffLon = parseFloat(dropoffRes[0].lon)
      }

      setPickupCoords([pickupLat, pickupLon])
      setDropoffCoords([dropoffLat, dropoffLon])

      const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          Authorization: '5b3ce3597851110001cf6248b5753e1881984b7c875a1ab843598fb8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates: [[pickupLon, pickupLat], [dropoffLon, dropoffLat]]
        })
      })

      const json = await res.json()
      const coords = json.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon])
      setRouteCoords(coords)
    } catch (err) {
      alert('Failed to load route: ' + err.message)
    }
  }
  useEffect(() => {
    const rideId = localStorage.getItem('currentRideId')
    if (!rideId) return

    const getRideDetails = async () => {
      try {
        const res = await fetch('https://drivana-backend.vercel.app/api/drive/')
        const data = await res.json()
        const ride = data.find(item => item.id.toString() === rideId.toString())

        if (ride && ride.details?.pickup && ride.details?.dropoff) {
          await fetchRoute(ride.details.pickup, ride.details.dropoff)
        } else {
          console.warn('Ride not found or missing details')
        }
      } catch (err) {
        console.error('Error fetching ride:', err)
      }
    }

    getRideDetails()
  }, [])

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl />
        {userCoords && (
          <>
            <Marker position={userCoords} />
            <Recenter coords={userCoords} />
          </>
        )}
        {pickupCoords && <Marker position={pickupCoords} icon={pickupIcon} />}
        {dropoffCoords && <Marker position={dropoffCoords} icon={dropoffIcon} />}
        {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
      </MapContainer>
    </div>
  )
}

export default MapOnly
