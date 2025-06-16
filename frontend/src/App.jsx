import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './components/Landing'
import Activity from './components/Activity'
import Maps from './components/Maps'
import Login from './components/Login'
import Help from './components/Help'
import Notify from './components/Notify'
import Food from './components/Food'
import Search from './components/Search'
import Menu from './components/Menu'
import Biryani from './components/Biryani'
import Calories from './components/Calories'
import Carts from './components/Carts'
import Offers from './components/Offers'
import BottomNav from './components/Navbar'
import Rents from './components/Rents'
import Hotel from './components/Hotel'
import Deliver from './components/Deliver'
import Drive from './components/Drive'
import Nav from './components/Nav'
import Profile from './components/Profile'
import Courier from './components/Courier'
import Pickup from './components/Pickup'
import Certificates from './components/Certificates'
import Ready from './components/Ready'
import Find from './components/Find'
import Mapview from './components/Mapview'
import './App.css'
function Layout() {
  const location=useLocation()
  const showBottomNavPaths=['/food', '/calories', '/cart','/biryani','/offers']
  const showNavPaths=['/landing','/find','/courier','/rentals','/activity','/profile']
  const shouldShowBottomNav=showBottomNavPaths.includes(location.pathname)
  const shouldShowNav=showNavPaths.includes(location.pathname)
  return (
    <>
      <Toaster position="top-center"/>
      {shouldShowBottomNav && <BottomNav/>}
      {shouldShowNav && <Nav/>}
      <Routes>
        <Route path='/landing' element={<Maps/>}/>
        <Route path='/activity' element={<Activity/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/help' element={<Help/>}/>
        <Route path='/notify' element={<Notify/>}/>
        <Route path='/food' element={<Food/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/menu' element={<Menu/>}/>
        <Route path='/biryani' element={<Biryani/>}/>
        <Route path='/offers' element={<Offers/>}/>
        <Route path='/cart' element={<Carts/>}/>
        <Route path='/drive' element={<Drive/>}/>
        <Route path='/deliver' element={<Deliver/>}/>
        <Route path='/rents' element={<Rents/>}/>
        <Route path='/hotel' element={<Hotel/>}/>
        <Route path='/calories' element={<Calories/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/courier' element={<Courier/>}/>
        <Route path='/pickup' element={<Pickup/>}/>
        <Route path='/certify' element={<Certificates/>}/>
        <Route path='/ready' element={<Ready/>}/>
        <Route path='/find' element={<Find/>}/>
        <Route path='/find' element={<Find/>}/>
        <Route path='/mappy' element={<Mapview/>}/>
        <Route path='/mapview' element={<Ready onlyMap={true}/>}/>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
