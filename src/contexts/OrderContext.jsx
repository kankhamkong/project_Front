import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const OrderContext = createContext();

const OrderContextProvider = ({ children }) => {
    const [order, setOrder] = useState([]);
    const [ orderDetail, setOrderDetail] = useState([]);
    const [refreshorder, setRefreshorder] = useState(false);
    
    useEffect(() => {
      const fetchOrder = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await axios.get('http://localhost:8889/order/order', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setOrder(response.data.order); // Corrected typo from "oderItems"
            setOrderDetail(response.data.orderDetails)
          }
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
      };
      fetchOrder();
    }, [refreshorder]);

    const addToOrder = async (id) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          "http://localhost:8889/order/order",
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder([...order, response.data]); // Corrected from OrderContext to order
        console.log('Cart added to order successfully', response.data);
        setRefreshorder(!refreshorder);
      } catch (error) {
        console.error("Error adding to order:", error);
      }
    };

   

  return (
    <OrderContext.Provider value={{ order, addToOrder, orderDetail,setRefreshorder, setOrder, setOrderDetail}}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContextProvider };
export default OrderContext;
