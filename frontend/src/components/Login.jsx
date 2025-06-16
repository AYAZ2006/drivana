import React, { useState,useRef } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
function Login() {
  const[username,setUsername]=useState('')
  const[password,setPassword]=useState('')
  const[role,setRole]=useState('User')
  const[phone,setPhone]=useState('+91')
  const[otp,setOtp]=useState(false)
  const[show,setShow]=useState(true)
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const[picture,setPicture]=useState('')
  const[disable,setDisable]=useState(false)
  const[gshow,setGshow]=useState(false)
  const inputRefs=[useRef(null),useRef(null),useRef(null),useRef(null)]
  const[no,setNo]=useState('')
  const[login,setLogin]=useState(false)
  const navigate=useNavigate()
  const handleClick=()=>{
    setDisable(true)
    setTimeout(()=>{
        setDisable(false)
    },60000)
  }
  const handleChange=(e,index)=>{
    const value=e.target.value;
    if (value.length===1 && index<inputRefs.length-1){
      inputRefs[index+1].current.focus()
    }
  }
  const handleKeyDown=(e, index)=>{
    if (e.key==='Backspace' && !e.target.value && index> 0){
      inputRefs[index-1].current.focus()
    }
  }
  const handleRegister=async(e)=>{
    e.preventDefault()
    try
    {
        await axios.post('https://drivana-backend.vercel.app/api/register/', { username,password,role })
        navigate('/landing')
    }
    catch(error)
    {
      alert('error')
    }
}
const handleLogin=async(e)=>{
  e.preventDefault();
  try{
      await axios.post('https://drivana-backend.vercel.app/api/login/',{username,password,role})
      localStorage.setItem('username',username)
      if(role==='User'){
        navigate('/landing')
      }
      if(role==='Driver Partner'){
        try{
          const check=await axios.get(`https://drivana-backend.vercel.app/api/${username}/details/`)
          if(check.data.length>0){
            navigate('ready')
          }
          else{
            navigate('/drive')
          }
        }
        catch{
          alert('Unable to check details at the moment.')
        }
      }
      if(role==='Logistics Partner'){
        try{
          const check=await axios.get(`https://drivana-backend.vercel.app/api/${username}/details/`)
          if(check.data.length>0){
            navigate('ready')
          }
          else{
            navigate('/drive')
          }
        }
        catch{
          alert('Unable to check details at the moment.')
        }
      }
      if(role==='Restaurant Partner'){
        navigate('/hotel')
      }
  }
  catch(error){
      console.error(error)
      alert('Login failed! Invalid credentials.')
  }
}
const handleLoginSuccess=(credentialResponse)=>{
  try {
    const decoded = jwtDecode(credentialResponse.credential)
    setName(decoded.name || '')
    setEmail(decoded.email || '')
    setPicture(decoded.picture || '')
  }catch (err){
    console.error('Error decoding JWT:', err)
  }
}
const handleLoginError=()=>{
  alert('Google Login Failed')
}
const sendOtp=async()=>{
  const response=await fetch('https://drivana-backend.vercel.app/api/send-otp/',{method:'POST',headers:{'Content-Type':'application/json',},body:JSON.stringify({email})})
  const data=await response.json()
  if(data.message){
    toast.success(`otp has been successfully sent to ${email}`)
  }
  else{
    toast.success(`otp has been successfully sent to ${email}`)
  }
}
const verifyOtp=async()=>{
  const response=await fetch('https://drivana-backend.vercel.app/api/verify-otp/',{method:'POST',headers:{'Content-Type':'application/json',},body:JSON.stringify({email,otp})})
  const data=await response.json()
  if(data.message){
    alert('otp has been successfully verified')
  }
  else{
    alert('otp not been verified')
  }
}
  return (
    <div className="bg-blue-950 flex justify-center items-center min-h-screen p-4">
      {gshow && (
        <motion.div className="absolute top-5 left-5 right-5 z-10" initial={{ height: 0, opacity: 0 }} animate={{ height: show ? 80 : 0, opacity: show ? 1 : 0 }} transition={{ duration: 1, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
          <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
        </motion.div>
      )}
      <div className="flex flex-col md:flex-row bg-white w-full max-w-md rounded-3xl overflow-hidden">
        <div className="w-full p-4">
          <div className="w-full flex justify-center mt-4 md:hidden">
            <div className="flex border border-blue-500 rounded-full overflow-hidden shadow-md">
              <button onClick={() => setLogin(true)} className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${ login ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}>Sign In</button>
              <button onClick={() => setLogin(false)} className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${ !login ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}>Sign Up</button>
            </div>
          </div>
          <strong className="text-center block text-2xl font-bold">{login ? 'Sign In' : 'Sign Up'}</strong>
          <div className="flex justify-center gap-3 mt-5">
            <button className="rounded-full" onClick={() => setGshow(!gshow)}><img src="https://cdn-icons-png.flaticon.com/128/10110/10110386.png" className="w-6 h-6" /></button>
            <button className="rounded-full"><img src="https://cdn-icons-png.flaticon.com/128/2175/2175193.png" className="w-6 h-6" /></button>
            <button className="rounded-full"><img src="https://cdn-icons-png.flaticon.com/128/2111/2111432.png" className="w-6 h-6" /></button>
            <button className="rounded-full"><img src="https://cdn-icons-png.flaticon.com/128/1384/1384014.png" className="w-6 h-6" /></button>
          </div>
          <hr className="mt-5" />
          <p className="text-center mt-2">{login ? 'or use your username & password' : 'or use your mobile number otp'}</p>
          <div className="flex flex-col gap-4 mt-4">
            <input type="text" placeholder="Enter your username" className="border px-2 py-2 rounded font-bold" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <div className="flex items-center">
              <input type={show ? 'password' : 'text'} placeholder={login ? 'Enter your password' : 'Enter a strong password'} className="border px-2 py-2 w-full rounded-l font-bold" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <button type="button" className="border px-2 py-2 rounded-r font-bold" onClick={() => setShow(!show)}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>
          {!login && (
            <>
              <div className="flex mt-4 gap-2">
                <input type="email" className="flex-1 border px-2 py-2 rounded font-bold" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <button className={`px-4 py-2 border rounded font-bold ${disable ? 'opacity-40' : ''}`} onClick={() => {setOtp(true);handleClick();sendOtp();}}disabled={disable}>GO</button>
              </div>
              {otp && (
                <div className="flex justify-center gap-2 mt-4">
                  {inputRefs.map((ref, index) => (
                    <div key={index} className="border-2 w-10 h-10 rounded flex items-center justify-center focus-within:border-blue-500">
                      <input ref={ref} type="text" maxLength={1} onChange={(e) => handleChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} className="w-full text-center text-2xl outline-none"/>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <select className="mt-5 w-full border px-2 py-2 rounded-full" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>User</option>
            <option>Driver Partner</option>
            <option>Logistics Partner</option>
            <option>Rental Partner</option>
            <option>Restaurant Partner</option>
          </select>
          <button onClick={(e) => (login ? handleLogin(e) : handleRegister(e))} className="mt-6 w-full py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">{login ? 'SIGN IN' : 'SIGN UP'}</button>
        </div>
        <div className="hidden md:flex md:flex-col md:justify-center md:items-center md:w-1/2 bg-gradient-to-r from-indigo-500 to-teal-400 text-white p-4">
          <p className="text-center mb-4 text-sm font-medium">{login? 'Sign up today to unlock all the features of our platform. Enjoy a seamless experience!': 'Sign in to access rides, deliveries, rentals, and food — all in one smart platform.'} </p>
          <button type="button" onClick={() => setLogin(!login)} className="px-4 py-2 bg-white text-blue-700 rounded-full font-semibold hover:bg-blue-600 hover:text-white">{login ? 'SIGN UP' : 'SIGN IN'}</button>
        </div>
      </div>
    </div>
  )
}

export default Login
