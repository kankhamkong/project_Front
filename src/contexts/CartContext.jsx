import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CartContext = createContext()

const CartContextProvider = ({ children }) => {
  
  const [cart, setCart] = useState([]);
  const [refreshCart, setRefreshCart] = useState(true);

  let token = localStorage.getItem('token');

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const getApiCart = async () => {
    try {
      const rs = await axios.get('http://localhost:8889/cart/cart',{
        headers: {
          Authorization: `Bearer ${token}`
        }}
      );
      if (rs.status === 200) {
        setCart(rs.data.cartItems.map(item => ({ ...item, quantity: item.quantity || 1 })));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
  useEffect(() => {

    if (refreshCart) {
      getApiCart();
      setRefreshCart(false);
    }
    getApiCart();

  }, [refreshCart, token]);

  const hdlDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8889/cart/cart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        Swal.fire({
          title: 'ลบสินค้า',
          text: 'ลบสินค้าออกจากตะกร้าเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        }).then(() => {
          // อัปเดต cart เพื่อลบรายการที่มี id เหมือนกันทั้งหมด
          const updatedCart = cart.filter((item) => item.id !== id);
          setCart(updatedCart);
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };
  
  // const updateCart = async (id, quantity) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.put(`http://localhost:8889/cart/${id}`, {
  //       quantity: quantity
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  
  //     console.log('Cart updated successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error updating cart:', error);
  //   }
  // };

  return (
    <CartContext.Provider value={{ cart, setCart , addToCart, setRefreshCart, hdlDelete }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContextProvider };
export default CartContext;