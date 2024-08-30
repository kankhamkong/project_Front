import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import productAuth from "../hooks/productAuth";
import Swal from "sweetalert2";

export default function Books() {
  const { addBook } = productAuth();
  const [input, setInput] = useState({
    title: "",
    author: "",
    price: "",
    volume: "",
    rate: "",
    image: "",
    category: "",
    stock: 0, // Initialize stock with 0
  });
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setInput((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Error reading file. Please try another file.');
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      alert('No file selected. Please select a file.');
    }
  };

  const hdladd = (e) => {
    e.preventDefault();
    addBook(input);
    navigate('/');
    Swal.fire({
      title: "Upload สำเร็จ",
      text: "ข้อมูลหนังสือถูกเพิ่มเรียบร้อย",
      icon: "success",
      confirmButtonText: "ตกลง",
    });
  };

  const hdlChange = (e) => {
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="hero min-h-screen bg-[#592828]">
      <div className="bg-slate-200 rounded shadow p-4">
        <a className="flex flex-col text-xl items-center">เพิ่มหนังสือ</a>
        <div className="flex flex-col items-left text-xl">
          <a>title </a>
          <input
            className="block text-xl rounded-md shadow-md"
            name="title"
            value={input.title}
            onChange={hdlChange}
          />
          <a>author </a>
          <input
            className="block text-xl rounded-md shadow-md"
            name="author"
            value={input.author}
            onChange={hdlChange}
          />
          <a>price </a>
          <input
            className="block text-xl rounded-md shadow-md"
            name="price"
            value={input.price}
            onChange={hdlChange}
          />
          <a>volume</a>
          <input
            className="block text-xl rounded-md shadow-md"
            name="volume"
            value={input.volume}
            onChange={hdlChange}
          />
          <a>rate </a>
          <input
            className="block text-xl rounded-md shadow-md"
            name="rate"
            value={input.rate}
            onChange={hdlChange}
          />
          <a>category </a>
          <select
            className="block text-xl rounded-md shadow-md"
            name="category"
            value={input.category}
            onChange={hdlChange}
          >
            <option value="">เลือกประเภท</option>
            <option value="แอ็คชั่น">แอ็คชั่น</option>
            <option value="แฟนตาซี">แฟนตาซี</option>
            <option value="โรแมนติก">โรแมนติก</option>
            <option value="สยองขวัญ">สยองขวัญ</option>
          </select>
          <a>stock </a>
          <input
            className="block text-xl rounded-md shadow-md"
            type="number"
            name="stock"
            value={input.stock}
            min="0" // Ensure stock cannot be below 0
            onChange={hdlChange}
          />
          <a>image </a>
          <input
            className="block text-xl"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Display the image preview */}
          {input.image && (
            <div className="mt-4">
              <img
                src={input.image}
                alt="Selected"
                className="max-w-full h-auto rounded-md shadow-md "
              />
            </div>
          )}

          <div className="flex flex-col items-center">
            <button
              onClick={hdladd}
              className="my-5 text-white w-60 h-55 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              UPLOAD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
