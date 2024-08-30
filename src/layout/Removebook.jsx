import React, { useState } from "react";
import axios from "axios";
import productAuth from "../hooks/productAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Pagbook() {
  const { products, handleDelete, setRefreshProduct } = productAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredProducts = products.filter((product) => {
    return (
      product.id.toString().includes(searchQuery) ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const updateProduct = async (input) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(`http://localhost:8889/book/${input.id}`, input, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRefreshProduct((prev) => !prev);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProductHandler = async () => {
    try {
      await updateProduct(updatedProduct);
      setShowEditModal(false); // Close edit modal
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleEditModal = (product) => {
    setUpdatedProduct(product);
    setShowEditModal(!showEditModal);
  };

  return (
    <div className="bg-[#592828] min-h-screen pt-24 p-2">
      <div className="max-w-[90rem] mx-auto my-22">
        <div className="flex items-center mb-4 my-5">
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1"
            placeholder="Enter Book ID or Book Title to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-[85rem] divide-y divide-gray-200">
            <thead className="bg-pink-60">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Id
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Author
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Price
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Stock
                </th>{" "}
                {/* Added stock */}
                <th className="px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Image
                </th>
                <th className="px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Options
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <Product
                    key={item.id}
                    product={item}
                    handleDelete={handleDelete}
                    toggleEditModal={toggleEditModal}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    ไม่พบข้อมูล
                  </td>{" "}
                  {/* Updated colspan */}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
          <div
            className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            style={{ marginTop: "10rem" }} // เพิ่มค่า margin-top ที่นี่
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Edit Product
                  </h3>
                  <div className="mt-2">
                    <form>
                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Title:
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={updatedProduct.title || ""}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="author"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Author:
                        </label>
                        <input
                          type="text"
                          id="author"
                          name="author"
                          value={updatedProduct.author || ""}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="price"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Price:
                        </label>
                        <input
                          type="text"
                          id="price"
                          name="price"
                          value={updatedProduct.price || ""}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="volume"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Volume:
                        </label>
                        <input
                          type="text"
                          id="volume"
                          name="volume"
                          value={updatedProduct.volume || ""}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="rate"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Rate:
                        </label>
                        <input
                          type="text"
                          id="rate"
                          name="rate"
                          value={updatedProduct.rate || ""}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="category"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Category:
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={updatedProduct.category || ""}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Select Category</option>
                          <option value="แอ็คชั่น">แอ็คชั่น</option>
                          <option value="แฟนตาซี">แฟนตาซี</option>
                          <option value="โรแมนติก">โรแมนติก</option>
                          <option value="สยองขวัญ">สยองขวัญ</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="stock"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Stock:
                        </label>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          value={updatedProduct.stock || ""}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={updateProductHandler}
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="mt-3 inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-base font-medium text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Product({ product, handleDelete, toggleEditModal }) {
  const deleteProduct = () => {
    Swal.fire({
      title: "คำเตือน",
      text: "แน่ใจว่าคุณจะลบหนังสือเล่มนี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบหนังสือนี้",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(product.id);
      }
    });
  };

  let stockMessage;
  if (product.stock <= 0) {
    stockMessage = "สินค้าหมด";
  } else if (product.stock <= 3) {
    stockMessage = `สินค้าใกล้หมด (${product.stock})`;
  }

  return (
    <tr className="hover:bg-gray-100 rounded-sm shadow-md">
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.id}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.title}</td>
      <td className="whitespace-nowrap overflow-hidden">{product.author}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.price}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.volume}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.rate}</td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">{product.category}</td>
      <td className={`whitespace-nowrap overflow-hidden overflow-ellipsis ${product.stock <= 3 ? (product.stock <= 0 ? 'text-red-500' : 'text-yellow-500') : ''}`}>
        {stockMessage || product.stock}
      </td>
      <td className="whitespace-nowrap overflow-hidden overflow-ellipsis">
        <img className="max-h-[80px]" src={product.image} alt={product.title} />
      </td>
      <td className="flex justify-center my-[2rem]">
        <button
          onClick={() => toggleEditModal(product)}
          className="text-white w-20 h-30 bg-yellow-500 hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-900"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button
          onClick={deleteProduct}
          className="text-white w-20 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
}
