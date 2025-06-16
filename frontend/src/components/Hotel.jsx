import React, { useState } from 'react'

function Hotel() {
    const[upload,setUpload]=useState(false)
    const[rate,setRate]=useState(false)
    const[post,setPost]=useState(false)
    const[image,setImage]=useState(null)
    const[price,setPrice]=useState('')
    const handleImageChange=(e)=>{
      setImage(e.target.files[0])
    }
  const handleUpload=async(e)=>{
    e.preventDefault()
    if (!image || !price) {
      alert('Please select an image and enter a price.')
      return
    }
    const formData=new FormData()
    formData.append('image',image)
    formData.append('price',price)
    try {
      const res=await fetch('https://your-backend.com/api/upload', {method: 'POST',body: formData,})
      } catch (err) {
        alert('Something went wrong!')
      }
    }
    return (
    <div className='bg-white h-167'>
      <div className="bg-black p-4 flex gap-5 justify-center">
        <div className="bg-white text-black h-12 px-3 rounded-lg shadow hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-all duration-200 text-2xl" onClick={()=>setUpload(true)}>Upload</div>
        <div className="bg-white text-black h-12 px-3 rounded-lg shadow hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-all duration-200 text-2xl" onClick={()=>setRate(true)}>Ratings</div>
        <div className="bg-white text-black h-12 px-3 rounded-lg shadow hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-all duration-200 text-2xl" onClick={()=>setPost(true)}>Posted</div>
      </div>
      {upload && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto space-y-4">
          <form onSubmit={handleUpload} className="space-y-4">
            <h1 className='fixed text-2xl'>Place your item image:</h1>
            <div className='w-20 ml-65'>
              <label htmlFor="file-upload" className="cursor-pointer w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl shadow-md hover:bg-blue-700 transition">+</label>
              <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" required/>
            </div>
            <input type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required/>
            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">Submit</button>
          </form>
        </div>
      )}
      {rate && (
        <div></div>
      )}
      {post && (
        <div></div>
      )}
    </div>
  )
}

export default Hotel
