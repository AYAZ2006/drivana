import React from 'react'
import { useNavigate } from 'react-router-dom'
function Menu() {
  const navigate=useNavigate()
  const images=['/biryani.png','/burger.png','/cake.png','/chapathi.png','/chinese.png','/dessert.png','/icecream.png','/idli.png','/kebab.png','/maida.png','/momos.png','/pasta.png','/rice.png','/rolls.png','/shawarma.png','/tiffins.png','/tiffins2.png','/veg.png']
  const names=['BIRYANIS','BURGERS','CAKES','PAROTAS','CHINESE','DESSERTS','ICECREAMS','IDLIS','KEBABS','MAIDA STUFFS','MOMOS','PASTA','RICE','ROLLS','SHAWARMAS','TIFFINS','TIFFINS-2','VEG']
  const navis=['/biryani','/burger','/cake','/chapathi','/chinese','/dessert','/icecream','/idli','/kebab','/maida','/momos','/pasta','/rice','/rolls','/shawarma','/tiffins','/tiffins2','/veg']
  return (
    <div className='bg-white h-435'>
      {images.map((image,index)=>(
        <div key={index} className="flex items-center curosr-pointer justify-between border-t border-gray-300 px-4 py-2" onClick={()=>navigate(navis[index])}><div className="flex items-center gap-2"><img src={image} alt={names[index]} className="h-20" /><h1 className="font-bold">{names[index]}</h1></div><img src="https://cdn-icons-png.flaticon.com/128/271/271228.png"className="h-6"alt="arrow"/></div>
      ))}
    </div>
  )
}

export default Menu
