import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
function Offers() {
  const divs=[
    {id:'div1',label:'Get 20% OFF on your first order',mt:'mt-10',hmt:'5' },
    {id:'div2',label:'Summer Special: Coolers and shakes at half price',mt:'mt-40',hmt:'2'},
    {id:'div3',label:'Weekend Specials',mt:'mt-70',hmt:'5'},
    {id:'div4',label:'Recommended by friend',mt:'mt-100',hmt:'5'},
  ]
  const[hiddenDivs,setHiddenDivs]=useState({})
  const[seen,setSeen]=useState(false)
  const[num,setNum]=useState(0)
  const[code,setCode]=useState(false)
  const[dis,setDis]=useState(false)
  useEffect(()=>{
    const stored=localStorage.getItem('destroyedOffers')
    if (stored) {
      const parsed=JSON.parse(stored)
      const now=Date.now()
      const valid={}
      for (const[id,time] of Object.entries(parsed)){
        if (now-time<3600*1000) {
          valid[id]=time
        }
      }
      setHiddenDivs(valid)
      localStorage.setItem('destroyedOffers',JSON.stringify(valid))
    }
  }, [])
  const handleClick=(id)=>{
  const newHidden={...hiddenDivs,[id]:Date.now()}
  setHiddenDivs(newHidden)
  localStorage.setItem('destroyedOffers', JSON.stringify(newHidden))
  alert('Your coupon code will expire in 1 hour. Make sure you don’t miss this!')
}
  return (
    <div className='bg-white h-164'>
      {divs.map((div) =>
        !hiddenDivs[div.id] ? (
          <div key={div.id} className={`bg-[#212121] fixed h-20 ml-6 w-80 rounded-[20px] ${div.mt}`} onClick={()=>{setSeen(true);setNum(id)}}>
            <h1 className={`text-[#F5F5F5] mt-${div.hmt} ml-5 text-[20px]`}>{div.label}</h1>
          </div>)
      :null
      )}
    <AnimatePresence> 
      {seen && <motion.div className='h-140 rounded-3xl w-90 mt-5 ml-1.5 bg-gray-100 border-1 fixed z-100' initial={{opacity:0,height:0,scale:0.1}} animate={{opacity:1,height:'auto',scale:1}} exit={{opacity:0,height:0,scale:0.1}} transition={{duration:0.5}} style={{overflow:'hidden'}}>
        <button className='rounded-full h-10 w-10 border-1 ml-76 mt-4 bg-[#0f121b] text-white font-bold' onClick={()=>setSeen(false)}>X</button>
        <ol className='list-decimal ml-5 mt-5 font-bold'>
          <li className=''>Some offers may be exclusive to new users or selected accounts.</li>
          <li className='mt-10'>Each offer is valid for a limited period, which will be clearly mentioned in the offer details. Expired offers will not be honored under any circumstances.</li>
          <li className='mt-10'>each user can redeem an offer only once. Multiple uses of the same offer code by the same user may lead to cancellation.</li>
        </ol>
        <button className='rounded-full h-10 ml-28 mt-10 w-30 border-1 bg-[#0f121b] text-white font-bold' onClick={()=>{handleClick(num);setCode(true);setDis(true)}} disabled={dis}>Redeem</button>
        {code && <p className='font-extrabold ml-15 mt-10'>USE THIS CODE : DRIVANA55</p>}
      </motion.div>}
    </AnimatePresence>
    </div>
  );
}

export default Offers;
