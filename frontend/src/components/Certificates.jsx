import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Certificates(){
  const username=localStorage.getItem('username')
  const[vehicle,setVehicle]=useState('')
  const navigate=useNavigate()
  const documents=[
    { label: "Phone Number", placeholder: "Enter your phone number" },
    { label: "Pan Card", placeholder: "Enter your PanCard details" },
    { label: "Passbook", placeholder: "Enter your Passbook details" },
    { label: "Aadhaar Card", placeholder: "Enter your AadhaarCard details" },
    { label: "Address Proof", placeholder: "Enter your Address proof details" },
    { label: "Insurance No", placeholder: "Enter your Insurance details" },
    { label: "Registration No", placeholder: "Enter your Registration details" },
    { label: "Vehicle permit", placeholder: "Enter your Vehicle permit details" },
    { label: "Pollution permit", placeholder: "Enter your Pollution permit details" },
    { label: "Driving Licence", placeholder: "Enter your Driving Licence details" },
    { label: "Vehicle permit", placeholder: "Enter your Vehicle permit details" },
  ]
  const [inputs, setInputs]=useState(Array(documents.length).fill(""))
  const handleChange=(index,value)=>{
    const newInputs=[...inputs]
    newInputs[index]=value
    setInputs(newInputs)
  }
  const handleVehicle=(e)=>{
  const value=e.target.value
  setVehicle(value)
  localStorage.setItem(value)
  const newInputs=[...inputs]
  newInputs[documents.length]=`Vehicle Type:${value}`
  setInputs(newInputs)
  }
  const handleSubmit=async()=>{
    if (inputs.some((input,index)=>index<documents.length && input.trim()==="")){
    alert("Please fill out all the fields.")
    return
    }
    try{
        await axios.post(`https://drivana-backend.vercel.app/api/${username}/details/`,{details:inputs})
        setInputs(Array(documents.length).fill(""))
        navigate('/ready')
    }
    catch{
      alert('server error!')
    }
  }
  return (
    <div className='overflow-auto-y min-h-200'>
      <h1 className='text-white h-10 text-2xl mt-5 rounded-2xl mx-5 flex items-center justify-center'>UPLOAD YOUR DOCUMENTS</h1>
      {documents.map((doc,index)=>(
        <div key={index} className='flex bg-gray-100 mt-10 rounded-2xl w-90 h-20 items-center justify-center gap-x-4 mx-2'>
          <h1 className='font-bold whitespace-nowrap'>{doc.label}:</h1>
          <input placeholder={doc.placeholder} className='w-55 border rounded-[5px] h-10 px-2' required value={inputs[index]} onChange={(e) => handleChange(index, e.target.value)}/>
        </div>
      ))}
      <select className='border rounded-full bg-white h-10 ml-25 mt-5' value={vehicle} onChange={handleVehicle}>
        <option>Motor Bike 👤1</option>
        <option>Auto 👤3</option>
        <option>Drivana Go 👤4</option>
        <option>Premiere 👤4</option>
        <option>Sedan 👤4</option>
        <option>XL+ (Innova) 👤6</option>
        <option>Drivana XL 👤6</option>
      </select>
      <button onClick={handleSubmit} className='rounded-full bg-gray-300 w-50 h-10 mt-10 ml-20 font-bold'>SUBMIT</button>
    </div>
  );
}

export default Certificates;
