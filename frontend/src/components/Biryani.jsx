  import React, { useEffect, useState } from 'react'
  import BottomNav from './Navbar'
  function Biryani() {
    const images=['b.png','b1.png','b2.png','b3.png','b4.png','b5.png','b6.png','b7.png','b8.png','b9.png','b10.png','b11.png','b12.png']
    const names=['MEHFIL TAJ BIRYANI','ARABIAN MANDI','CHICKEN AND EGG BIRYANI','CHICKEN MATKI BIRYANI','CHICKEN DAM BIRYANI','PISTA HOUSE BIRYANI','PARADISE BIRYANI','HYDERABADI TANDOOR BIRYANI','DIAMOND BIRYANI','AFGHANI BIRYANI','MUGHLAI BIRYANI','LUCKNOWI BIRYANI','PANEER BIRYANI']
    const prices=[350, 300, 320, 340, 360, 280, 400, 370, 310, 330, 350, 340, 290]
    const[counts,setCounts]=useState(Array(images.length).fill(0))
    const[cart,setCart]=useState([])
    useEffect(()=>{
      const total=counts.reduce((sum,value)=>sum+value,0)
      localStorage.setItem('total',total)
      localStorage.setItem('cart', JSON.stringify(cart))
    },[cart,counts])
    const inc=(index)=>{
      const newcounts=[...counts]
      newcounts[index]+=1
      setCounts(newcounts)
      const newcart=[...cart]
      const itemIndex=newcart.findIndex(item=>item.name===names[index])
      if(itemIndex>=0){
      newcart[itemIndex].quantity+=1
      }else{
      newcart.push({name: names[index],image: images[index],price: prices[index],quantity: 1})
    }
    setCart(newcart)
    }
    const dec=(index)=>{
      const newcounts=[...counts]
      if(newcounts[index]>0){
        newcounts[index]-=1
        setCounts(newcounts)
        const newCart=[...cart]
        const itemIndex=newCart.findIndex(item=>item.name===names[index])
        if(itemIndex>=0){
          if(newCart[itemIndex].quantity===1){
            newCart.splice(itemIndex,1)
          }else{
            newCart[itemIndex].quantity-=1
          }
        }
        setCart(newCart)
      }
    }
    return (
      <div className='bg-white h-920 pb-20'>
        {images.map((image, index) => (
        <div key={index} className="h-70 w-94 flex flex-col items-center  border">
        <img src={image} alt={`Image ${index}`} className="h-40 w-80"/>
        <p className="text-center font-bold">{names[index]}</p>
        <button className='h-10 border w-20 rounded-full ml-[-200px] mt-5 cursor-pointer' onClick={()=>inc(index)}>Add Item</button>
        <p className='h-10 flex w-10 border rounded-full mt-[-40px] ml-[-40px] items-center justify-center'>{counts[index]}</p>
        <button className='h-10 border w-10 rounded-full mt-[-40px] ml-20 cursor-pointer' onClick={()=>dec(index)}>-</button>
        <p className='mt-[-38px] ml-50 text-2xl'>₹{prices[index]}</p>
        </div>
        ))}
      </div>
    )
  }

  export default Biryani
