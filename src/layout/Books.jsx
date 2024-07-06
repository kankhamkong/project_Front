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
    category: ""
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
    <div className="hero min-h-screen bg-rose-900">
      <div className="bookdi">
        <a className="flex flex-col items-center">เพิ่มหนังสือ</a>
        <div className="flex flex-col items-left text-xl">
          <a>title </a>
          <input
            className="block text-xl"
            name="title"
            value={input.title}
            onChange={hdlChange}
          />
          <a>author </a>
          <input
            className="block text-xl"
            name="author"
            value={input.author}
            onChange={hdlChange}
          />
          <a>price </a>
          <input
            className="block text-xl"
            name="price"
            value={input.price}
            onChange={hdlChange}
          />
          <a>volume</a>
          <input
            className="block text-xl"
            name="volume"
            value={input.volume}
            onChange={hdlChange}
          />
          <a>rate </a>
          <input
            className="block text-xl"
            name="rate"
            value={input.rate}
            onChange={hdlChange}
          />
          <a>category </a>
          <input
            className="block text-xl"
            name="category"
            value={input.category}
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

          <div className="flex flex-col items-center">
            <button
              onClick={hdladd}
              className="text-white w-60 h-55 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              UPLOAD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
