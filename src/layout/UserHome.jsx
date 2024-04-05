import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import ProductContext, { ProductContextProvider } from '../contexts/ProductContext';
import { Link } from 'react-router-dom';

export default function UserHome() {

  const {product} = useContext(ProductContext)

  // console.log(product);
  return (
          <div className="hero min-h-screen bg-rose-900">
    <div className='top'>Top 10 Manga
      <div className='manga'>
      {product && product.map(item => (
        <HomeProduct key={item.id} product={item}/>
      ))}
      </div>
    </div>
  </div>
     
  )

}



function HomeProduct({product}){


  const hdlWedmanga = () => {
    // Replace this with your navigation mechanism
    window.location.href = '/Wed';
  }

  return (
<div>
     <Link to={`/topee/${product.id}`}><img src={product.image} alt="" className='manga' /></Link> 
</div>
  )
}