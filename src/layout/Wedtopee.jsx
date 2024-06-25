import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import cartAuth from "../hooks/cartAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Wedtopee() {
  const id = window.location.pathname.split("/")[2];
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const { setCart } = cartAuth();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8889/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Book data fetched:", response.data.idbook);
        setBook(response.data.idbook);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!book) {
      console.error("Book data not loaded yet");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        'http://localhost:8889/cart/cart',
        {
          bookId: book?.id,
          amount: 1
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("Added to cart:", response.data);
      setCart(prevCart => [...prevCart, response.data]);

      // แสดงการแจ้งเตือนตรงกลาง
      toast.success("เพิ่มลงในตระกร้าสำเร็จ!", {
        position: "top-center",
      });
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("เกิดข้อผิดพลาดในการเพิ่มลงในตระกร้า!", {
        position: "top-center",
      });
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!book) {
      console.error("Book data not loaded yet");
      return;
    }

    const createCart = {
      bookId: book?.id,
      amount: 1
    };

    try {
      const token = localStorage.getItem("token");
      const rs = await axios.post('http://localhost:8889/cart/cart', createCart, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (rs.status === 200) {
        navigate("/market");
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      {book && (
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${book.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)', // Apply the blur effect
          zIndex: -1
        }}></div>
      )}
      <div className="min-h-screen pt-24 p-2 flex justify-center items-center relative z-10">
        <div className="tap text-left">
          {book ? (
            <div className="flex flex-col items-center py-20">
              <div className="flex items-center justify-center">
                <img src={book.image} width={210} height={150} alt={book.title} />
                <div className="ml-4 text-white">
                  <label className="block text-white text-4xl">{book.title}</label>
                  <label className="block text-white text-xl">author: {book.author}</label>
                  <label className="block text-white text-xl">{book.currency} {book.price}</label>
                  <label className="block text-white text-xl">volume: {book.volume}</label>
                  <label className="block text-white text-xl">{book.rate}</label>
                  <div className="">
                    <div>
                      <button
                        onClick={handleAddToCart}
                        className="text-white w-50 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-0 mt-3 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 "
                      >
                        เพิ่มลงในตระกร้า
                      </button>
                    </div>
                    <button
                      onClick={handleBuyNow}
                      className="text-white w-20 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-0 mt-5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                      ซื้อ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white">ไม่พบข้อมูล</p>
          )}
        </div>
        {/* <ToastContainer position="top-center" /> */}
      </div>
    </div>
  );
}
