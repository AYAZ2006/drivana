import React from 'react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BottomNav from './Navbar'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
function Food() {
  const settings={
    dots:true,
    infinite:true,
    speed:500,
    slidesToShow:2,
    slidesToScroll:1,
  }
  const items=['pizza','burger','biryani','pulao','drinks','anything']
  const data=[
    {
      name:'Get 30% OFF',
      image:'',
      description:'Use code BIRYANI30'
    },
    {
      name:'Best Nearby Restaurants',
      image:'',
      description:'Order Now'
    },
    {
      name:'Earn rewards',
      image:'',
      description:'Points balance: “💰 320 Points”'
    }
  ]
  const[index,setIndex]=useState(0)
  const[time,setTime]=useState(0)
  const navigate=useNavigate()
  useEffect(()=>{
  const storedEnd=localStorage.getItem('endTime')
  if (!storedEnd) {
    const end=Date.now()+3600*1000
    localStorage.setItem('endTime',end)
  }
},[])
useEffect(() => {
  const interval=setInterval(()=>{
    const endTime=localStorage.getItem('endTime')
    if (endTime){
      const diff=Math.floor((parseInt(endTime)-Date.now())/1000)
    if(diff<=0){
      const newEndTime=Date.now()+3600*1000;
      localStorage.setItem('endTime',newEndTime);
      setTime(3600);
    }
    else{
      setTime(diff);
    }
    }
  },1000)
  return()=>clearInterval(interval)
  },[])
  const times=(seconds)=>{
    return new Date(seconds*1000).toISOString().substring(11,19)
  }
  useEffect(()=>{
    if (index>=items.length-1) return;
    const interval=setInterval(()=>{
      setIndex((prev)=>(prev+1)%items.length)
    },2000)
    return ()=>clearInterval(interval)
  },[index])
  return (
    <div className='bg-white h-166'>
      <div className='bg-[#0f121b] h-50 rounded-bl-4xl rounded-br-4xl'>
        <div className='bg-white h-15 w-75 rounded-full fixed mt-8 ml-9 flex cursor-pointer' onClick={()=>navigate('/search')}>
            <img src='https://cdn-icons-png.flaticon.com/128/149/149852.png' className='h-10 mt-2.5 ml-2'></img>
            <p className='text-blue-900 mt-3.5 ml-4 text-[20px]'>Search for</p>
            <AnimatePresence mode="wait">
                <motion.div key={items[index]}initial={{ opacity: 0, y: 20 }}animate={{ opacity: 1, y: 0 }}exit={{ opacity: 0, y: -20 }}transition={{ duration: 0.6 }} className="absolute ml-40 mt-3.5"><span className="text-blue-900 text-[20px]">{items[index]}</span></motion.div>
            </AnimatePresence>
            <img src='https://cdn-icons-png.flaticon.com/128/5577/5577350.png' className='h-10 mt-2.5 ml-23'></img>
        </div>
        <img src='https://cdn-icons-png.flaticon.com/128/12369/12369422.png' className='h-10 fixed mt-25 ml-10'></img>
        <h1 className='text-red-500 font-bold text-2xl mt-25 ml-20 fixed'>Quick Bites Special</h1>
        <div className='h-10 w-75 fixed mt-35 ml-13 rounded-3xl flex'>
          <div className='bg-white w-60 h-10 fixed flex rounded-full'>
            <p className='mt-2 ml-3 fixed font-bold'>ends in {times(time)}</p>
            <div className='bg-red-500 rounded-3xl w-25 ml-35 h-10 z-10 cursor-pointer' onClick={()=>navigate('/menu')}>
              <p className='mt-2 ml-2 font-bold'>Order Now</p>
            </div>
          </div>
        </div>
      </div>
      <div className='h-70 w-79 mt-5 ml-7'>
        <div className=''>
          <style>{`.slick-prev:before, .slick-next:before { color: red !important; font-size: 20px }`}</style>
          <Slider {...settings}>
          {data.map((d)=>(
            <div className='bg-white h-[350px] text-black rounded-xl border-b-1'>
              <div className='rounded-t-xl bg-indigo-600 flex justify-center items-center'><img src={d.image} className='h-44 w-44 rounded-full'></img></div>
              <div className='flex flex-col justify-center items-center gap-4 p-4'>
                <p className='text-xl font-semibold'>{d.name}</p>
                <p>{d.description}</p>
                <button onClick={()=>navigate('/offers')} className='border-2 rounded-full text-white cursor-pointer bg-blue-600 w-20'>Get Now</button>
              </div>
            </div>
          ))}
        </Slider>
        </div>
      </div>
    </div>
  )
}

export default Food
