import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [refreshCart, setRefreshCart] = useState(false); // New state for triggering cart refresh

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:8889/cart/cart', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCart(response.data.cartItems);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    fetchCart();
  }, [refreshCart]);

  const addToCart = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8889/cart/${id}`, 
        null, // Assuming no additional data needed for POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart([...cart, response.data]);
      console.log('Item added to cart successfully:', response.data);
      setRefreshCart(!refreshCart); // Trigger cart refresh after successful addition
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const hdlDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8889/cart/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        Swal.fire({
          title: 'ลบหนังสือ',
          text: 'ลบหนังสือออกจากระบบเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
        }).then(() => {
          // Update the cart state after successful deletion
          const updatedCart = cart.filter((item) => item.id !== id);
          setCart(updatedCart);
          setRefreshCart(!refreshCart); // Trigger cart refresh after successful deletion
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  };

  const updateCart = async (id, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8889/cart/cart/${id}`, 
        { quantity }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: response.data.quantity } : item
      );
      setCart(updatedCart);
      console.log('Cart updated successfully:', response.data);
      setRefreshCart(!refreshCart); // Trigger cart refresh after successful update
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, hdlDelete, updateCart, loading, setRefreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContextProvider };
export default CartContext;
