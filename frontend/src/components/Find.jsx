  import React, { useState, useEffect } from 'react'
  import { motion } from 'framer-motion'
  import { Rings } from 'react-loader-spinner'
  import axios from 'axios'
  import { MapContainer, TileLayer, Marker } from 'react-leaflet'
  import 'leaflet/dist/leaflet.css'
  import {useNavigate} from 'react-router-dom'
  function Find() {
    const[load,setLoad]=useState(true)
    const[messageIndex,setMessageIndex]=useState(0)
    const[driverName,setDriverName]=useState(null)
    const[driverPhone,setDriverPhone]=useState(null)
    const[price,setPrice]=useState(null)
    const navigate=useNavigate()
    const messages = [
      "Looking for nearby drivers...",
      "Waiting for driver confirmation...",
      "Driver found. Awaiting acceptance...",
      "Be patient. Almost there...",
      "Hang tight. We're almost ready!"
    ]
    useEffect(()=>{
      if (!load) return
      const interval=setInterval(()=>{
        setMessageIndex(prev=>{
          if (prev<messages.length-1) return prev+1
          return prev
        })
      },5000)
      return ()=>clearInterval(interval)
    },[load])
    useEffect(()=>{
    const rideId=localStorage.getItem('currentRideId')
    if (!rideId) return
    const poll=setInterval(async()=>{
      try{  
        const res=await fetch('https://drivana-backend.vercel.app/api/drive/')
        const data=await res.json()
        const ride=data.find(r => r.id === parseInt(rideId))
        if(ride?.accepted_by){
          setDriverName(ride.accepted_by)
          setPrice(ride.details?.price)
          clearInterval(poll)
        }
      }catch (err){
        console.error('Polling failed:', err)
      }
    }, 3000)
    return ()=>clearInterval(poll)
  },[])
  const handleNum=async()=>{
    if(!driverName) return
    try{
      const response=await axios.get(`https://drivana-backend.vercel.app/api/${driverName}/details/`)
      const phone=response.data?.[0]?.details?.[0]
      setDriverPhone(phone)
    }catch{
      alert('driver not verified')
    }
  }
  useEffect(() => {
    if (driverName) {
      handleNum()
      const sound=new Audio("/sound.mp3")
      sound.play()
      const stopSound=setTimeout(()=>{
        sound.pause()
        sound.currentTime=0
      }, 5000)
      return ()=>clearTimeout(stopSound)
    }
  },[driverName])
    return (
      <div className="relative bg-white h-screen">
        <div className="h-[60vh] bg-black">
          <iframe src='http://localhost:5173/mappy' className='w-full h-100'></iframe>
        </div>
        {load && !driverName && (
          <>
            <div className="absolute left-0 w-full h-2 bg-gray-200">
              <motion.div initial={{width:'0%'}} animate={{width:'80%'}} transition={{duration:30,ease:'easeInOut',repeat:0}} className="h-full bg-blue-500"/>
            </div>
            <div className="absolute top-35 left-45 transform -translate-x-1/2">
              <Rings visible={true} height="100" width="100" color="#ffffff" ariaLabel="rings-loading" wrapperStyle={{}} wrapperClass="" />
            </div>
            <button className="rounded-full bg-black text-white font-bold h-10 w-30 fixed mt-10 ml-30" onClick={async () => { const rideId = localStorage.getItem('currentRideId'); if (!rideId) return alert('No ride found'); try { await fetch('http://127.0.0.1:8000/api/drive/', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: parseInt(rideId) }) }); alert('Ride cancelled');navigate('/landing')} catch (e) { console.error(e); alert('Cancellation failed');}}}>Cancel ride</button>
            <motion.div className="absolute mt-25 left-1/2  transform -translate-x-1/2 bg-blue-100 border w-full h-22 border-blue-300 text-blue-900 rounded-xl px-6 py-4 shadow-md" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
              <p className="text-2xl font-medium">{messages[messageIndex]}</p>
            </motion.div>
          </>
        )}
        {driverName && (
          <motion.div className="absolute mt-1 left-1/2  transform -translate-x-1/2 border bg-black w-full h-50 border-blue-300 text-blue-900 rounded-xl px-6 py-4 shadow-md" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <div className='flex mt-[-6px] rounded-full items-center'>
              <p className="text-xl font-semibold text-white ml-5 mt-[-10px]">Driver Accepted</p>
              <img src='https://cdn-icons-png.flaticon.com/128/10536/10536162.png' className='h-8 ml-5'></img>
              <p className='text-white font-bold text-xl ml-2'>₹{price}</p>
            </div>
            <div className='flex border-1 mt-3 rounded-full items-center h-15 bg-blue-100'>
              <img src='https://cdn-icons-png.flaticon.com/128/64/64572.png' className='h-12 ml-5 border-3 rounded-full border-white'/>
              <p className='text-2xl font-semibold ml-[20px] text-black'>Driver Name:{driverName}</p>
            </div>
            <div className='flex border-1 mt-3 rounded-full items-center h-15 bg-red-400'>
              <img src='https://cdn-icons-png.flaticon.com/128/3616/3616215.png' className='h-12 ml-5 border-3 rounded-full border-white'></img>
              <p className='text-2xl font-semibold text-black ml-5'>+91{driverPhone}</p>
              <img src='https://cdn-icons-png.flaticon.com/128/271/271228.png' className='h-5 ml-5'></img>
              <img src='https://cdn-icons-png.flaticon.com/128/271/271228.png' className='h-5 ml-[-10px]'></img>
              <img src='https://cdn-icons-png.flaticon.com/128/271/271228.png' className='h-5 ml-[-10px]'></img>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  export default Find;
