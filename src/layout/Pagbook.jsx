import React, { useState } from "react";
import productAuth from "../hooks/productAuth";
import Swal from "sweetalert2";

export default function Pagbook() {
  const { products, handleDelete, loading } = productAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("bookid");

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredProducts = products.filter((product) => {
    if (searchType === "bookid") {
      return product.id.toString().includes(searchQuery);
    } else {
      return product.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchQuery(""); // Clear search query when changing search type
  };

  return (
    <div className="bg-[#592828] min-h-screen pt-24 p-2">
      <div className="max-w-[80rem] mx-auto my-22">
        <div className="flex items-center mb-4">
          <select
            className="border border-gray-300 rounded px-2 py-1 mr-2"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="bookid">Search by Book ID</option>
            <option value="booktitle">Search by Book Title</option>
          </select>
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1"
            placeholder={`Enter ${searchType === "bookid" ? "Book ID" : "Book Title"} to search`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-pink-60">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Id</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Author</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Volume</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Rate</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Option</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredProducts.map((item) => (
                <Product key={item.id} product={item} handleDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Product({ product, handleDelete }) {
  const deleteProduct = () => {
    Swal.fire({
      title: "คำเตือน",
      text: "แน่ใจว่าคุณจะลบหนังสือเล่มนี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "คุณลบหนังสือนี้แล้ว",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(product.id);
      }
    });
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.id}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.title}</td>
      <td className="whitespace-nowrap overflow-hidden">{product.author}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.price}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.volume}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.rate}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.category}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">
        <img className="max-h-[80px]" src={`${product.image}`} alt={product.title} />
      </td>
      <td>
        <button
          onClick={deleteProduct}
          className="text-white w-20 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
