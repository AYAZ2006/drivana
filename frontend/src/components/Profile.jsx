import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Profile() {
 const [open, setOpen] = useState(false)
 const [tab, setTab] = useState('')
 const [op, setOp] = useState(false)
 const [inputValue, setInputValue] = useState('')
 const [userData, setUserData] = useState([])
 const navigate = useNavigate()
 const username = localStorage.getItem('username')
 const[edit,setEdit]=useState(false)
 const toggle = section => { setOpen(prev => (prev === section ? null : section)) }
 const handleInputChange = e => {
  const newVal = e.target.value
  setInputValue(newVal)
  const updated = [...userData.filter(entry => entry.type !== tab), { type: tab, value: newVal }]
  setUserData(updated)
 }

 const handlePost = async () => {
  try {
    const payload = userData.reduce((acc, item) => {
      acc[item.type] = item.value;
      return acc;
    }, {})

    await axios.post(`http://127.0.0.1:8000/api/${username}/personal/`, { details: payload });
    alert('Data saved successfully!')
  } catch {
    alert('server error!!')
  }
}


const handleFetch = async () => {
  try {
    const response=await axios.get(`http://127.0.0.1:8000/api/${username}/personal/`)
    const raw=Array.isArray(response.data) ? response.data[0] : response.data
    const details=raw.details
    if (!details || typeof details !== 'object' || Array.isArray(details)) {
      throw new Error('Invalid response format')
    }
    const formatted = Object.entries(details).filter(([type]) => type !== 'username').map(([type, value]) => ({ type, value }));setUserData(formatted)
    } catch (err) {
     alert(`Failed to fetch data: ${err.message}`)
   }
 }
 const getValue = type => {
  return userData.find(e => e.type === type)?.value || ''
 }

 return (
  <div className="bg-white h-screen overflow-y-auto">
    <button className='rounded-full bg-black text-white h-10 w-40 fixed ml-50 mt-5' onClick={()=>setEdit(true)}>Edit</button>
    <button className='rounded-full bg-black text-white h-10 w-40 ml-5 fixed mt-5' onClick={()=>{handleFetch();setEdit(false)}}>Get Info</button>
    {!edit && (
      <div className="px-6 pt-4 mt-20">
        {userData.map(({ type, value }, index) => (
          <div key={index} className="flex items-center justify-between bg-white shadow-sm border border-gray-200 rounded-xl px-4 py-2 mb-2 hover:shadow-md transition-shadow duration-200">
            <span className="text-gray-600 font-medium capitalize">{type.replace(/_/g, ' ')}</span>
            <span className="text-gray-800 font-semibold break-words text-right max-w-xs">{value}</span>
          </div>
        ))}
      </div>
    )}
   {edit && (
    <div className='mt-10'>
      <div className='flex justify-between items-center px-6 pt-6'>
       <h1 className='font-bold text-2xl'>User Info</h1>
       <img src={open === 'user' ? 'https://cdn-icons-png.flaticon.com/128/25/25678.png' : 'https://cdn-icons-png.flaticon.com/128/6364/6364586.png'} className='h-7 cursor-pointer' onClick={() => toggle('user')} />
      </div>
      <motion.div animate={{ y: open === 'user' ? 450 : 0 }} transition={{ duration: 0.3 }}>
       <div className='flex justify-between items-center px-6 pt-6'>
        <h1 className='font-bold text-2xl'>Address Book</h1>
        <img src={open === 'address' ? 'https://cdn-icons-png.flaticon.com/128/25/25678.png' : 'https://cdn-icons-png.flaticon.com/128/6364/6364586.png'} className='h-7 cursor-pointer' onClick={() => toggle('address')} />
       </div>
      </motion.div>
   
      <motion.div animate={{ y: open === 'user' ? 470 : open === 'address' ? 270 : 0 }} transition={{ duration: 0.3 }}>
       <div className='flex justify-between items-center px-6 pt-6'>
        <h1 className='font-bold text-2xl'>Payment Methods</h1>
        <img src={open === 'payment' ? 'https://cdn-icons-png.flaticon.com/128/25/25678.png' : 'https://cdn-icons-png.flaticon.com/128/6364/6364586.png'} className='h-7 cursor-pointer' onClick={() => toggle('payment')} />
       </div>
      </motion.div>
   
      <AnimatePresence>
       {open === 'user' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`px-6 space-y-2 ${op ? 'blur-sm pointer-events-none' : ''}`}>
         {['full name', 'mail address', 'phone number', 'pic', 'gender', 'dob', 'password'].map(type => (
          <div key={type} className='bg-gray-100 border rounded-2xl h-10 flex items-center justify-between pl-3 font-bold'>
           {type.charAt(0).toUpperCase() + type.slice(1)}: {getValue(type)}
           <button className='border-1 flex rounded-full h-5 w-5 items-center justify-center pb-1 bg-white font-bold mr-2' onClick={() => {setTab(type);setInputValue(getValue(type));setOp(true)
            }}>+</button>
          </div>
         ))}
        </motion.div>
       )}
   
       {open === 'address' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`px-6 mt-20 space-y-2 ${op ? 'blur-sm pointer-events-none' : ''}`}>
         {['home address', 'work address', 'other address'].map(type => (
          <div key={type} className='bg-gray-100 border rounded-2xl h-10 flex items-center justify-between pl-3 font-bold'>
           {type.charAt(0).toUpperCase() + type.slice(1)}: {getValue(type)}
           <button className='border-1 flex rounded-full h-5 w-5 items-center justify-center pb-1 bg-white font-bold mr-2' onClick={() => {setTab(type);setInputValue(getValue(type));setOp(true)}}>+</button>
          </div>
         ))}
        </motion.div>
       )}
   
       {open === 'payment' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`px-6 mt-30 space-y-2 ${op ? 'blur-sm pointer-events-none' : ''}`}>
         <div className='bg-gray-100 border rounded-2xl h-10 flex items-center justify-between pl-3 font-bold'>
            Add debitcard: {getValue('debitcard')}
          <button className='border-1 flex rounded-full h-5 w-5 items-center justify-center pb-1 bg-white font-bold mr-2' onClick={() => { setTab('debitcard');setInputValue(getValue('debitcard'));setOp(true)}}>+</button>
         </div>
        </motion.div>
       )}
   
       {op && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
         className="bg-gray-100 rounded-2xl p-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 backdrop-blur-sm shadow-lg w-11/12 max-w-md">
         <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg capitalize">{tab} Edit</h2>
          <button onClick={() => setOp(false)} className="text-red-500 font-bold">Close</button>
         </div>
         <input type="text" value={inputValue} onChange={handleInputChange} placeholder={`Enter new ${tab}`} className="w-full border border-gray-300 rounded p-2" />
        </motion.div>
       )}
      </AnimatePresence>
      <button onClick={handlePost} className='fixed bottom-35 left-2/4 transform -translate-x-1/2 h-10 px-6 bg-blue-500 text-white font-bold rounded-2xl shadow-md'>Save</button>
    </div>
   )}
   <button className='fixed bottom-20 left-2/4 transform -translate-x-1/2 h-10 px-6 bg-red-500 text-white font-bold rounded-2xl shadow-md' onClick={() => {localStorage.setItem('username', '');navigate('/')}}>LogOut</button>
  </div>
 )
}

export default Profile
