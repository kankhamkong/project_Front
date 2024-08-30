import React from 'react';
import productAuth from '../hooks/productAuth';
import { Link } from "react-router-dom";

export default function TypeUser() {
  const { products, setRefreshProduct } = productAuth();

  const filterUniqueProducts = (products) => {
    if (!products) return [];
    const seenTitles = new Set();
    return products.filter((product) => {
      if (seenTitles.has(product.title)) {
        return false;
      } else {
        seenTitles.add(product.title);
        setRefreshProduct((prev) => !prev);
        return true;
      }
    });
  };

  const uniqueProducts = filterUniqueProducts(products);

  return (
    <div className="bg-[#592828] min-h-screen pt-24 p-2 text-white text-2xl">
      <div className="flex items-center justify-center">
        <h1 className="m-4 inline-block">แอ็คชั่น</h1>
        <hr className="border-white h-px flex-grow ml-4" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mx-auto">
        {uniqueProducts
          .filter((el) => el.category === "แอ็คชั่น")
          .map((item) => <HomeProduct key={item.id} product={item} />)}
      </div>
      <div className="flex items-center justify-center">
        <h1 className="m-4 inline-block">แฟนตาซี</h1>
        <hr className="border-white h-px flex-grow ml-4" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mx-auto">
        {uniqueProducts
          .filter((el) => el.category === "แฟนตาซี")
          .map((item) => <HomeProduct key={item.id} product={item} />)}
      </div>
      <div className="flex items-center justify-center">
        <h1 className="m-4 inline-block">โรแมนติก</h1>
        <hr className="border-white h-px flex-grow ml-4" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mx-auto">
        {uniqueProducts
          .filter((el) => el.category === "โรแมนติก")
          .map((item) => <HomeProduct key={item.id} product={item} />)}
      </div>
      <div className="flex items-center justify-center">
        <h1 className="m-4 inline-block">สยองขวัญ</h1>
        <hr className="border-white h-px flex-grow ml-4" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mx-auto">
        {uniqueProducts
          .filter((el) => el.category === "สยองขวัญ")
          .map((item) => <HomeProduct key={item.id} product={item} />)}
      </div>
    </div>
  );
}

function HomeProduct({ product }) {
  return (
    <div className="flex justify-center items-center text-lg">
      <Link to={`/topee/${product.id}`}>
        <img 
          src={`${product.image}`} 
          alt="" 
          className="manga max-w-[200px] transition transform hover:scale-110" 
        />
      </Link>
    </div>
  );
}
