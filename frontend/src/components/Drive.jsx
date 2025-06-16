import React from 'react'
import { useNavigate } from 'react-router-dom'
function Hotel() {
  const navigate=useNavigate()
  return (
    <div className='bg-white min-h-250 overflow-auto-y'>
      <p className='font-bold text-2xl ml-7'>Registration is super simple</p>
      <button className='border-1 rounded-full bg-black text-white w-20 h-10 ml-35 mt-5' onClick={()=>navigate('/certify')}>Let's go</button>
      <div className='border-1 w-80 rounded-2xl bg-gray-100 mt-15 ml-5 h-60'>
        <img src='https://drive.olacabs.com/img/ownerIcon.ec231d10.svg' className='mt-[-50px] h-30'></img>
        <h1 className='font-bold text-2xl ml-5'>Owner Documents</h1>
        <div className='flex ml-5 mt-[20px]'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>PAN Card</h1>
        </div>
        <div className='flex ml-5'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Cheque or Passbook</h1>
        </div>
        <div className='flex ml-5'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Aadhaar Card</h1>
        </div>
        <div className='flex ml-5'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Address Proof</h1>
        </div>
      </div>
      <div className='border-1 w-80 rounded-2xl bg-gray-100 mt-15 ml-5 h-60'>
        <img src='https://drive.olacabs.com/img/ownerIcon.ec231d10.svg' className='mt-[-50px] h-30'></img>
        <h1 className='font-bold text-2xl ml-5'>Vehicle Documents</h1>
        <div className='flex ml-5 mt-[20px]'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Registration certificate</h1>
        </div>
        <div className='flex ml-5'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Insurance document</h1>
        </div>
        <div className='flex ml-5'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Vehicle Permit</h1>
        </div>
        <div className='flex ml-5'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Pollution certificate</h1>
        </div>
      </div>
      <div className='border-1 w-80 rounded-2xl bg-gray-100 mt-15 ml-5 h-60'>
        <img src='https://drive.olacabs.com/img/ownerIcon.ec231d10.svg' className='mt-[-50px] h-30'></img>
        <h1 className='font-bold text-2xl ml-5'>Driver Documents</h1>
        <div className='flex ml-5 mt-[20px]'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Driver Licence</h1>
        </div>
        <div className='flex ml-5'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Profile Photo</h1>
        </div>
        <div className='flex ml-5'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Aadhaar Card</h1>
        </div>
        <div className='flex ml-5'>
          <img src='https://drive.olacabs.com/img/fileIcon.cda7731b.svg'></img>
          <h1>Address Proof</h1>
        </div>
      </div>
      </div>
  )
}

export default Hotel
