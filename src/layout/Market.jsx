import React, { useEffect } from "react";
import cartAuth from "../hooks/cartAuth";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Market() {
  const { cart, hdlDelete, setCart, refreshCart, getApiCart,updateCart } = cartAuth();

  // const addToCart = (id) => {
  //   const updatedCart = cart.map((item) => {
  //     if (item.id === id) {
  //       return { ...item, quantity: item.quantity + 1 };
  //     }
  //     return item;
  //   });
  //   setCart(updatedCart);
  // };

  const removeFromCart = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        // ลดจำนวนสินค้าลง 1 หรือลบออกถ้าเป็น 0
        const newQuantity = item.quantity > 0 ? item.quantity - 1 : 0;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
  
    setCart(updatedCart);
  };

  // Function to calculate the total price of items in the cart
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.book?.price) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  useEffect(() => {
    // localStorage.setItem("cart", JSON.stringify(cart));
    // let token = localStorage.getItem("token");
    // const getApiCart = async () => {
    //   try {
    //     const rs = await axios.get("http://localhost:8889/cart/cart", {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     if (rs.status === 200) {
    //       setCart(rs.data.cartItems);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching cart:", error);
    //   }
    // };
    getApiCart();
  }, [refreshCart]);

  const groupByBookId = (cartItems) => {
    return cartItems.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.book?.id === item.book?.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
  };

  const groupedCart = groupByBookId(cart);

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
          <div className="">
            {groupedCart.length === 0 ? (
              <p className="text-5xl text-red-700 flex flex-col justify-center items-center">ไม่มีสินค้าในตระกร้า</p>
            ) : (
              <>
                {groupedCart.map((el, index) => (
                  <div key={index} className="border border-indigo-600 w-[40rem] h-[9rem] m-4 p-4 flex justify-between">
                    <div className="flex">
                      <div className="flex flex-col mr-4">
                        <div className="flex">
                          {el.book && el.book.image ? (
                            <img
                              src={el.book.image}
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
                    <div className="flex justify-between ">
                    <button className="m-2 " onClick={() => updateCart(el.id)}>เพิ่ม</button>
                    <p className="flex justify-between items-center">จำนวน: {el.quantity}</p>
                    <button className="m-2" onClick={() => removeFromCart(el.id)}>ลด</button>
                      <button className="m-2" onClick={() => hdlDelete(el.id)}>ลบ</button>
                    </div>
                  </div>
                ))}
                <hr />
                <div className="flex flex-col justify-center items-center">
                  <Link to="/" className="group">
                    <button className="group-hover:underline group-hover:text-red-500">เลือกสินค้าเพิ่มในตะกร้า</button>
                  </Link>
                </div>
                <div className="border border-indigo-600 w-[40rem] h-[7rem] m-4 p-4 flex flex-col justify-center items-center">
                  <p>Total Price: {calculateTotalPrice().toFixed(2)} THB</p>
                  <div className="flex m-1">
                    <button className="text-white w-40 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-0 mt-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                      ชำระสินค้า
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
