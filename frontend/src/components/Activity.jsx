import React, { useEffect, useState } from 'react'
import axios from 'axios'
function Activity() {
  const[orders,setOrders]=useState([])
  const username=localStorage.getItem('username')
  useEffect(()=>{
    const fetch=async()=>{
      try{
        const response1=await axios.get(`https://drivana-backend.vercel.app/api/${username}/orders/`)
        const response2=await axios.get(`https://drivana-backend.vercel.app/api/${username}/rides/`)
        const merged=[...response1.data,...response2.data]
        setOrders(merged)
      }catch{
        alert('server error!')
      }
    }
    fetch()
  },[username])
  return (
    <div className="p-4 overflow-y-auto max-h-150">
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ):(
        orders.map((order,index)=>{
          const date=new Date(order.timestamp)
          const formattedDate=date.toLocaleString()
          return (
            <div key={index} className="p-4 mb-4 bg-gray-100 rounded-md shadow-md">
              <p className="text-sm text-gray-500">Date: {formattedDate}</p>
              {order.order_name?(
                <>
                  <p className="font-semibold">Items: {order.order_name.join(', ')}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Total Price: ₹{order.total_price}</p>
                </>
              ):(
                <>
                  <p className="font-semibold">Pickup:{order.pickup}</p>
                  <p className='font-semibold'>Dropoff:{order.dropoff}</p>
                  <p>Ride Type:{order.ride_type}</p>
                  <p>Total Fare:₹{order.total_price}</p>
                </>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

export default Activity
