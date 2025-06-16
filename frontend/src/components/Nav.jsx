import React from 'react'
import { useNavigate } from 'react-router-dom'

const Nav=()=>{
  const navigate=useNavigate()
  return (
    <div className='fixed bottom-0 w-full bg-white h-[60px] flex justify-around items-center z-50'>
      <div className='flex flex-col items-center cursor-pointer text-black' onClick={() => navigate('/landing')}>
        <img src='https://cdn-icons-png.flaticon.com/128/1946/1946436.png' className='h-6' />
        <h6 className='text-xs mt-1'>Home</h6>
      </div>
      <div className='flex flex-col items-center cursor-pointer text-black' onClick={() => navigate('/courier')}>
        <img src='https://cdn-icons-png.flaticon.com/128/5669/5669732.png' className='h-8' />
        <h6 className='text-xs'>Courier</h6>
      </div>
      <div className='flex flex-col items-center cursor-pointer text-black' onClick={() => navigate('/food')}>
        <img src='https://cdn-icons-png.flaticon.com/128/753/753839.png' className='h-8 mt-1' />
        <h6 className='text-xs'>Food</h6>
      </div>
      <div className='relative flex flex-col cursor-pointer items-center text-black' onClick={() => navigate('/activity')}>
        <img src='https://cdn-icons-png.flaticon.com/128/5000/5000023.png' className='h-8 mt-1' />
        <h6 className='text-xs'>Activity</h6>
      </div>
      <div className='relative flex flex-col cursor-pointer items-center text-black' onClick={() => navigate('/profile')}>
        <img src='https://cdn-icons-png.flaticon.com/128/64/64572.png' className='h-8 mt-1' />
        <h6 className='text-xs'>Profile</h6>
      </div>
    </div>
  );
};

export default Nav;
