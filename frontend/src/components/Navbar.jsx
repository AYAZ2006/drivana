import React from 'react'
import { useNavigate } from 'react-router-dom'

const BottomNav=()=>{
  const navigate=useNavigate()
  const total=localStorage.getItem('total')
  return (
    <div className='fixed bottom-0 w-full bg-white h-[60px] flex justify-around items-center z-50'>
      <div className='flex flex-col items-center cursor-pointer text-black' onClick={() => navigate('/food')}>
        <img src='https://cdn-icons-png.flaticon.com/128/1946/1946436.png' className='h-6' />
        <h6 className='text-xs mt-1'>Home</h6>
      </div>
      <div className='flex flex-col items-center cursor-pointer text-black' onClick={() => navigate('/menu')}>
        <img src='https://cdn-icons-png.flaticon.com/128/1836/1836767.png' className='h-6' />
        <h6 className='text-xs mt-1'>Menu</h6>
      </div>
      <div className='flex flex-col items-center cursor-pointer text-black' onClick={() => navigate('/offers')}>
        <img src='https://cdn-icons-png.flaticon.com/128/879/879859.png' className='h-6' />
        <h6 className='text-xs mt-1'>Offers</h6>
      </div>
      <div className='relative flex flex-col cursor-pointer items-center text-black' onClick={() => navigate('/cart')}>
        <img src='https://cdn-icons-png.flaticon.com/128/3514/3514491.png' className='h-6' />
        <span className='absolute -top-1 right-0 h-4 w-4 text-xs flex items-center justify-center bg-red-500 rounded-full'>
          {total}
        </span>
        <h6 className='text-xs mt-1'>Cart</h6>
      </div>
    </div>
  );
};

export default BottomNav;
