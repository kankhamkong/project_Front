import React, { useEffect, useState } from "react";
import cartAuth from "../hooks/cartAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import orderAuth from "../hooks/orderAuth";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Market() {
  const { cart, hdlDelete, updateCart } = cartAuth();
  const { user } = useAuth();
  const { setRefreshorder } = orderAuth();
  const [groupedCart, setGroupedCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const groupCartItems = () => {
      const grouped = cart?.reduce((acc, item) => {
        const existingItem = acc.find((el) => el.book.id === item.book.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);
      setGroupedCart(grouped);
    };

    groupCartItems();
  }, [cart]);

  // Function to calculate total price
  const calculateTotalPrice = () => {
    return groupedCart.reduce((total, item) => total + item.book.price * item.quantity, 0);
  };

  // Function to increment quantity
const incrementQuantity = (id) => {
  const filerCart = groupedCart.filter((item) => item.id === id);
  const currentItem = filerCart.find((item) => item.id === id);

  if (currentItem) {
    // Check if current quantity is less than the stock
    if (currentItem.quantity < currentItem.book.stock) {
      // Set quantity to max available stock
      const updatedCart = currentItem.book.stock;
      updateQuantity(id, updatedCart);
    } else {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเพิ่มจำนวนได้",
        text: "คุณได้เพิ่มหนังสือถึงจำนวนสูงสุดที่มีในสต็อกแล้ว!",
      });
    }
  }
};

  // Function to decrement quantity
  const decrementQuantity = async (id) => {
    const updatedCart = groupedCart.map((item) =>
      item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    );
    if (updatedCart.find((item) => item.id === id).quantity === 0) {
      try {
        await hdlDelete(id); // Assuming hdlDelete handles the API call to delete the item
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    } else {
      updateQuantity(id, updatedCart.find((item) => item.id === id).quantity);
    }
  };

  // Function to update quantity directly
  const updateQuantity = async (id, quantity) => {
    try {
      await updateCart(id, quantity); 
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const hdlGopay = async () => {
    try {
      let token = localStorage.getItem('token');
      const rs = await axios.post('http://localhost:8889/order/order', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(rs);
      if (rs.status === 200) {
        console.log("add to Order");
        navigate("/order");
        setRefreshorder((prev) => !prev);
      }
    } catch (err) {
      console.error("Error buying now:", err);
      alert("เกิดข้อผิดพลาดในการเข้าชำระ!");
    }
  };

  return (
    <>
      <div className="max-w-[100rem] bg-white flex justify-center items-center">
        <div className="mx-auto p-4 my-28">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl">ตระกร้าของฉัน</h1>
            <img src="img/shopping-cart.png" alt="" width={80} />
            <p className="text-lg">เลือกหนังสือที่ต้องการชำระเงิน</p>
          </div>
          <hr className="my-4" />
          <div className="flex flex-col justify-between items-center">
            {groupedCart.length === 0 ? (
              <p className="text-5xl text-red-700 flex flex-col justify-center items-center">ไม่มีสินค้าในตระกร้า</p>
            ) : (
              <>
                {groupedCart && groupedCart?.map((el, index) => (
                  <div key={index} className="bg-gray-200 w-[40rem] h-[9rem] m-4 p-4 flex justify-between">
                    <div className="flex">
                      <div className="flex flex-col mr-4">
                        <div className="flex">
                          {el.book && el.book.image ? (
                            <img
                              src={`${el.book.image}`}
                              width={70}
                              alt={el.book.title}
                              className="rounded"
                            />
                          ) : (
                            <div className="w-[130px] h-[130px] bg-gray-200 flex items-center justify-center rounded">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h1 className="text-xl font-bold">{el.book?.title || "No Title"}</h1>
                        <p className="text-md">เล่ม: {el.book?.volume || "N/A"}</p>
                        <p className="text-md">{el.book?.currency} {el.book?.price || "No Price"}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">  
                      <button className="m-2 bg-green-500 h-[2rem] w-[3rem] rounded-lg text-white" onClick={() => incrementQuantity(el.id)}>เพิ่ม</button>
                      <p className="">จำนวน: {el.quantity}</p> 
                      <button className="m-2  bg-red-500 h-[2rem] w-[3rem] rounded-lg text-white" onClick={() => decrementQuantity(el.id)}>ลด</button>
                    </div>
                    <div className="flex justify-between items-center ">
                    <Link><FontAwesomeIcon icon={faTrash}  />
                      <button className="m-2" onClick={() => hdlDelete(el.id)}>ลบ</button></Link>
                    </div>
                  </div>
                ))}
                <hr />
                <div className="flex flex-col justify-center items-center">
                  <Link to="/" className="group">
                    <button className="group-hover:underline group-hover:text-red-500">เลือกสินค้าเพิ่มในตะกร้า</button>
                  </Link>
                </div>
                <div className="bg-gray-200 w-[40rem] h-[7rem] m-4 p-4 flex flex-col justify-center items-center">
                  <p>จำนวนเงินทั้งสิ้น : {calculateTotalPrice().toFixed(2)} THB</p>
                  <div className="flex m-1">
                    <button 
                      onClick={hdlGopay}
                      className="text-white w-40 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-0 mt-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                      ไปหน้าชำระเงิน
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
