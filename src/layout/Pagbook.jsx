import React, { useContext, useEffect, useState } from "react";
import ProductContext, {
  ProductContextProvider,
} from "../contexts/ProductContext";
import axios from "axios";

export default function Pagbook() {
  const { product } = useContext(ProductContext);
  console.log(product);

  return (
    <div className="hero min-h-screen bg-rose-900">
      <div className="tap2 w-full">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-pink-60">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                  Id{" "}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                  title{" "}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                  author{" "}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                  price{" "}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                  volume{" "}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                  rate{" "}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                  image{" "}
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> option</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {product &&
                product.map((item) => <Product key={item.id} product={item} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function Product({ product }) {
  const hdlDelete = async (id) => {
    let token = localStorage.getItem("token");
    try {
      const rs = await axios.delete(`http://localhost:8889/book/book/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (rs.status === 200) {
        alert("delete success");
      }
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-100">
        <td className=" whitespace-nowrap overflow-hidden overflow-ellipsis">
          {product.id}
        </td>
        <td className=" whitespace-nowrap overflow-hidden overflow-ellipsis">
          {product.title}
        </td>
        <td className="whitespace-nowrap overflow-hidden">
          {product.author}
        </td>
        <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">
          {product.price}
        </td>
        <td className=" whitespace-nowrap overflow-hidden overflow-ellipsis">
          {product.volume}
        </td>
        <td className=" whitespace-nowrap overflow-hidden overflow-ellipsis">
          {product.rate}
        </td>
        <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">
          <img className="max-h-[100px]" src={product.image} alt="" srcset="" />
        </td>
        <td>
          <button
            onClick={() => hdlDelete(product.id)}
            className="text-white w-20 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            detele
          </button>
        </td>
      </tr>
    </>
  );
}
