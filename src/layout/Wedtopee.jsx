import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartAuth from "../hooks/cartAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import orderAuth from "../hooks/orderAuth";
import useAuth from "../hooks/useAuth";

export default function Wedtopee() {
  const id = window.location.pathname.split("/")[2];
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const { setRefreshCart, updateCart } = cartAuth();
  const [bookOptions, setBookOptions] = useState([]);
  const { setRefreshorder } = orderAuth();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8889/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBook(response.data.idbook);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    const fetchBookOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8889/book/book-options/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookOptions(response.data.books);
      } catch (error) {
        console.error("Error fetching book options data:", error);
      }
    };

    fetchBook();
    fetchBookOptions();
  }, [id]);

  const updateBookStock = async (bookId, newStock) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8889/book/${bookId}`,
        { stock: newStock },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating book stock:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดตสต็อกสินค้า!", {
        position: "top-center",
      });
    }
  };

  const handleAddToCart = async () => {
    if (!book) {
      console.error("Book data not loaded yet");
      return;
    }

    if (book.stock <= 0) {
      toast.error("สินค้าหมดแล้ว!", { position: "top-center" });
      return;
    }

    if (book.stock <= 3) {
      toast.warning("สินค้าใกล้จะหมดแล้ว!", { position: "top-center" });
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8889/cart/cart",
        {
          bookId: book?.id,
          amount: book?.price,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("เพิ่มลงในตระกร้าสำเร็จ!", {
          position: "top-center",
        });
        setRefreshCart((prev) => !prev);
        updateCart(book?.id, 1);

        // Update stock count locally
        const newStock = book.stock - 1;
        setBook((prevBook) => ({
          ...prevBook,
          stock: newStock,
        }));

        // Update stock count on server
        await updateBookStock(book.id, newStock);
      }
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

    if (book.stock <= 1) {
      toast.error("ไม่สามารถซื้อสินค้าได้ เพราะสินค้าเหลือเพียงชิ้นเดียว!", {
        position: "top-center",
      });
      return;
    }

    const createCart = {
      bookId: book?.id,
      amount: book?.price,
      quantity: 1,
    };

    try {
      const token = localStorage.getItem("token");
      const rs = await axios.post(
        `http://localhost:8889/cart/cart`,
        createCart,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (rs.status === 200) {
        console.log(rs.data);
        try {
          const rs1 = await axios.post(
            "http://localhost:8889/order/order",
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (rs1.status === 200) {
            navigate("/order");
            setRefreshorder((prev) => !prev);
            setRefreshCart((prev) => !prev);
            updateCart(book?.id, 1);

            // Update stock count locally
            const newStock = book.stock - 1;
            setBook((prevBook) => ({
              ...prevBook,
              stock: newStock,
            }));

            // Update stock count on server
            await updateBookStock(book.id, newStock);
          }
        } catch (err) {
          console.log("Error:", err);
          alert("เกิดข้อผิดพลาดปุ่มซื้อ ");
        }
      } else {
        console.error("Unexpected response status:", rs.status);
      }
    } catch (err) {
      console.error("Error buying now:", err);
      alert("เกิดข้อผิดพลาดในการซื้อสินค้า!");
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      {book && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${book.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
            zIndex: -1,
          }}
        ></div>
      )}
      <div className="min-h-screen pt-24 p-2 flex justify-center items-center relative z-10">
        <div className="tap text-left">
          {book ? (
            <div className="flex flex-col items-center py-5">
              <div className="flex items-center justify-center">
                <img
                  src={`${book.image}`}
                  width={210}
                  height={150}
                  alt={book.title}
                  className="rounded-md shadow-md"
                />
                <div className="ml-4 text-white">
                  <label className="block text-white text-4xl">
                    {book.title}
                  </label>
                  <label className="block text-white text-xl">
                    Author: {book.author}
                  </label>
                  <label className="block text-white text-xl">
                    {book.currency} {book.price}
                  </label>
                  <label className="block text-white text-xl">
                    Volume: {book.volume}
                  </label>
                  <label className="block text-white text-xl">
                    Category: {book.category}
                  </label>
                  <label className="">
                    {book.rate}
                  </label>
                  <label className="block text-white text-xl"></label>
                  จำนวนสินค้า: {book.stock}
                  {book.stock === 0 ? (
                    <p className="text-red-500 font-bold">สินค้าหมดแล้ว!</p>
                  ) : (
                    <div>
                      {user?.role !== "ADMIN" && (
                        <button
                          onClick={handleAddToCart}
                          disabled={book.stock === 0}
                          className={`text-white w-50 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-0 mt-3 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 ${
                            book.stock === 0 ? "cursor-not-allowed opacity-50" : ""
                          }`}
                        >
                          เพิ่มลงในตระกร้า
                        </button>
                      )}
                      {user?.role !== "ADMIN" && (
                        <button
                          onClick={handleBuyNow}
                          disabled={book.stock === 0}
                          className={`text-white w-20 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-0 mt-5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 ${
                            book.stock === 0 ? "cursor-not-allowed opacity-50" : ""
                          }`}
                        >
                          ซื้อ
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="self-start ml-[5rem] mt-5">
                <h1 className="text-white text-xl">เล่มอื่นใน ซีรี่ย์</h1>
              </div>
              <div className="mt-5 flex flex-wrap gap-4 justify-center">
                {bookOptions.map((el) => (
                  <div
                    key={el.id}
                    onClick={() => navigate(`/wedtopee/${el.id}`)}
                    className="tap cursor-pointer flex flex-col items-center"
                  >
                    <img
                      src={el.image}
                      alt={el.title}
                      className="rounded-md shadow-md"
                      style={{ width: "150px", height: "150px" }}
                    />
                    <div className="mt-2 text-center">
                      <h2 className="text-white text-md">{el.title}</h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-white text-xl text-center">
              ไม่พบข้อมูล
            </p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
