import React, { useState } from 'react'
function Pickup () {
  const[pickup,setPickup]=useState('')
  const[dropoff,setDropoff]=useState('')
  const[pickupSuggestions,setPickupSuggestions]=useState([])
  const[dropoffSuggestions,setDropoffSuggestions]=useState([])
  const geocode=async(place)=>{
    const res=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`)
    const data=await res.json()
    return data
  }
  const handlePickupChange=async(e)=>{
    setPickup(e.target.value)
    if(e.target.value.length>3){
      const suggestions=await geocode(e.target.value)
      setPickupSuggestions(suggestions)
    }else{
      setPickupSuggestions([])
    }
  }
  const handleDropoffChange=async(e)=>{
    setDropoff(e.target.value)
    if(e.target.value.length>3){
      const suggestions=await geocode(e.target.value)
      setDropoffSuggestions(suggestions)
    } else {
      setDropoffSuggestions([])
    }
  }
  const selectPickup=(address)=>{
    setPickup(address)
    localStorage.setItem('pickup', address)
    setPickupSuggestions([])
  }
  const selectDropoff=(address)=>{
    setDropoff(address)
    localStorage.setItem('dropoff', address)
    setDropoffSuggestions([])
  }
  return (
    <div>
      <input placeholder="Pickup location" value={pickup} onChange={handlePickupChange} className="border-3 w-80 rounded-3xl bg-white h-10 px-3 mt-10 ml-5"/>
      <input placeholder="Dropoff location" value={dropoff} onChange={handleDropoffChange} className="border-3 fixed w-80 rounded-3xl bg-white h-10 px-3 mt-30 left-5"/>
      {pickupSuggestions.length > 0 && (
        <div className="absolute z-50 space-y-2 w-90 max-h-120 ml-1 px-4 mt-5 overflow-y-auto  shadow-lg rounded">
          {pickupSuggestions.map((suggestion, index) => (
            <div key={index} onClick={() => selectPickup(suggestion.display_name)} className="border-2 border-gray-300 p-2 rounded cursor-pointer bg-white hover:bg-gray-100 z-50">{suggestion.display_name}</div>
          ))}
        </div>
      )}
      {dropoffSuggestions.length > 0 && (
        <div className="absolute z-50 space-y-2 w-90 max-h-120 ml-1 px-4 mt-25 overflow-y-auto  shadow-lg rounded">
          {dropoffSuggestions.map((suggestion, index) => (
            <div key={index} onClick={()=>selectDropoff(suggestion.display_name)} className="border-2 border-gray-300 p-2 rounded cursor-pointer bg-white hover:bg-gray-100">{suggestion.display_name}</div>
          ))}
        </div>
      )}
    </div>
  )
}
export default Pickup
