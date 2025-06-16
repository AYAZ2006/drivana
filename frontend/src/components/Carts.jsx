import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
function Carts() {
  const navigate=useNavigate()
  const[open,setOpen]=useState(false)
  const[yes,setYes]=useState('')
  const[items,setItems]=useState([])
  const[total,setTotal]=useState(0)
  const[dis,setDis]=useState(null)
  const username=localStorage.getItem('username')
  useEffect(()=>{
    const storedCart=JSON.parse(localStorage.getItem('cart'))||[]
    setItems(storedCart)
    const totalAmount=storedCart.reduce((sum,item)=>sum+(item.price*item.quantity),0)
    setTotal(totalAmount)
  },[])
  useEffect(()=>{
    if(yes==='DRIVANA55'){
      const discount=total*0.2
      setDis(total-discount)
      setOpen(false)
      setYes('')
    }
  },[yes,setOpen])
  const handleOrder=async(e)=>{
  e.preventDefault()
  const orderPayload={
    username:username,
    order_name: items.map(item => item.name),
    quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    total_price: dis !== null ? parseFloat(dis.toFixed(2)) : total
  }
  try {
    await axios.post(`https://drivana-backend.vercel.app/api/${username}/orders/`, orderPayload)
    localStorage.removeItem('cart')
    setItems([])
    setTotal(0)
    }catch(error){
    alert('Failed to place order')
    }
  }
  return (
    <div className='bg-white h-167'>
      <h1 className='fixed font-bold ml-33 mt-2 text-2xl'>MY CART</h1>
      <div className='fixed h-[1px] w-94 bg-black mt-11'></div>
      <div className='fixed mt-11 w-full max-h-100 overflow-y-auto'>
        {items.length===0 ? (
          <div className='mt-10 ml-30'>
            <p>Your cart is empty.</p>
            <button className='border-1 rounded-full w-30 bg-blue-500 h-10 text-white' onClick={()=>navigate('/menu')}>Order now</button>
          </div>
        ) : (
        items.map((item,index) => (
          <div key={index} className="p-4 mb-4 rounded-md w-90 ml-2 shadow-md">
            <img src={item.image} alt={item.name} className="w-40 h-28 object-cover" />
            <p className="text-xl font-semibold">{item.name}</p>
            <p className="text-md">Price: ₹{item.price}</p>
            <p className="text-md">Quantity: {item.quantity}</p>
            <p className="text-md font-bold">Subtotal: ₹{item.quantity * item.price}</p>
          </div>
        ))
      )}
      {total>0 && <div>
        <div className='h-1 bg-black mt-[-15px]'></div>
        <p className='text-md font-bold ml-50 mt-1'>Grand Total = ₹{dis!==null?dis.toFixed(2):total}</p>
      </div>}
      </div>
      <AnimatePresence>
        {open && <motion.div className='h-40 rounded-3xl w-90 mt-5 ml-1.5 bg-gray-100 border-1 fixed z-100' initial={{opacity:0,height:0,scale:0.1}} animate={{opacity:1,height:130,scale:1}} exit={{opacity:0,height:0,scale:0.1}} transition={{duration:0.5}} style={{overflow:'hidden'}}>
          <button className='rounded-full h-10 w-10 border-1 ml-76 mt-4 bg-[#0f121b] text-white font-bold' onClick={()=>setOpen(false)}>X</button>
          <input placeholder="Enter your claimed coupon" className="border-2 rounded-[8px] h-10 w-52 ml-17 font-bold transition-transform duration-500 active:scale-110" value={yes} onChange={(e)=>setYes(e.target.value)}/>
        </motion.div>}
      </AnimatePresence>
      <div className='fixed bg-[#0f121b] mt-116.5 w-94 h-35'>
        <button className='bg-white h-12 w-70 rounded-full ml-10 mt-5 cursor-pointer' onClick={()=>setOpen(true)}>Apply Offers</button>
        <div className='mt-3'>
        <button className='bg-white h-12 w-30 rounded-full ml-10' onClick={() => {localStorage.removeItem('cart');setItems([]);setTotal(0);localStorage.setItem('total',0)}}>Clear Cart</button>
        <button className='bg-blue-600 text-white h-12 w-30 rounded-full ml-10' onClick={(e)=>handleOrder(e)}>Order Now</button>
        </div>
      </div>
      <div className='bg-blue-700 h-0.5 fixed w-94 mt-151.5'></div>
    </div>
  )
}

export default Carts
