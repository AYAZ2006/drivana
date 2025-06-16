import React, { useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
function Landing() {
    const[ride,setRide]=useState(false)
    const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' })
    const heightValue = ride ? (isLargeScreen ? 500 : 600) : 0
    return (
        <div>
            <div className='rounded-full bg-white w-150 ml-5 mt-10 h-20 border-2 border-red-500 flex lg:w-375 cursor-pointer' onClick={() => setRide(prev => !prev)}>
                <div className='text-3xl mt-5 ml-5'>🔍</div>
                <div class="w-0.5 h-19 bg-black ml-3"></div>
                <h2 className='ml-15 text-5xl mt-3'>Where to?</h2>
            </div>
            <AnimatePresence>
                {ride && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 500, opacity: ride ? 1 : 0 }} transition={{ duration: 1, ease: "easeInOut" }} style={{ overflow: 'hidden' }} className='rounded-lg bg-white ml-6 mt-5 w-150 lg:w-370'>
                    <iframe src="http://localhost:5173/maps" className='w-430 h-135'></iframe>
                </motion.div>}
            </AnimatePresence>
        </div>
    );
}

export default Landing;
