import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ProductContext, {
  ProductContextProvider,
} from "../contexts/ProductContext";
import { Link } from "react-router-dom";

export default function UserHome() {
  const { product } = useContext(ProductContext);

  // console.log(product);
  return (
    // <div className="pt-20 bg-rose-900 flex items-center justify-center">
    //   <div className="top p-2">Manga
    //     <div className="manga">
    //       {/* {product &&
    //         product.map((item) => <HomeProduct key={item.id} product={item} />)} */}
    //         {product.map((product) => (
    //           <div className="">
    //           <Link to={`/topee/${product.id}`}>
    //             <img src={product.image} alt="" className="manga" />
    //           </Link>
    //         </div>
    //         ))}
    //     </div>
    //   </div>
    // </div>
    <>
    <div className="bg-rose-900 min-h-screen pt-24 p-2 text-white text-2xl m-2">
      <div className="flex items-center justify-center">
        <h1 className="m-4 inline-block">manga</h1>
        <hr className="border-white h-px flex-grow ml-4" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mx-auto">
        {product &&
          product.map((item) => <HomeProduct key={item.id} product={item} />)}
      </div>
    </div>
  </>
  );
}

function HomeProduct({ product }) {
  const hdlWedmanga = () => {
    window.location.href = "/Wed";
  };

  return (
    <div className="flex justify-center items-cente text-lg">
      <Link to={`/topee/${product.id}`}>
        <img src={product.image} alt="" className="manga max-w-[200px]" />
        <h2 className="flex justify-center items-cente"> {product.title}</h2>
        <p className="flex justify-center items-cente">{product.currency} {product.price}</p>
      </Link>
    </div>
  );
}
