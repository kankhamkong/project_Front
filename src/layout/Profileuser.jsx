import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import ProductContext, { ProductContextProvider } from '../contexts/ProductContext';
import { Link } from 'react-router-dom';

export default function UserHome() {
  const { product } = useContext(ProductContext);

  return (
    <div className="bg-cover h-screen bg-rose-900 flex items-center justify-center">
      <div className="top">
        <h1 className="text-white">Manga</h1>
        <div className="manga">
          {product && product.map(item => (
            <HomeProduct key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeProduct({ product }) {
  const handleWedManga = () => {
    window.location.href = '/Wed';
  };

  return (
    <div>
      <Link to={`/topee/${product.id}`}>
        <img src={product.image} alt="" className="manga" />
      </Link>
    </div>
  );
}
