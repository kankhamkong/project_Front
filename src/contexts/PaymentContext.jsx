import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const PaymentContext = createContext()
function PaymentContextProvider(props) {
    const [trigger, setTrigger] = useState(false)
    const [payment, setPayment] = useState(null)
    const [refreshPayment, setRefreshPayment] = useState(false)

    useEffect(() => {
        const run = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return
                const rs = await axios.get('http://localhost:8889/payment/payment', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                // .then(res => setTrigger(prv => !prv))
                setPayment(rs.data)

            } catch (error) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `${error.response.data.message}`,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }

        run()
    }, [trigger, refreshPayment])

    const createPayment = async (paymentData) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return
            await axios.post('http://localhost:8889/payment/add', { paymentData }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setTrigger(prv => !prv))
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: `${error.response.data.message}`,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const cancelPayment = async (paymentData, id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const rs = await axios.put(
                `http://localhost:8889/payment/statuscancel/${id}`,
                paymentData, // remove the curly braces around paymentData
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
    
            console.log(rs);
    
            if (rs.status === 200) {
                setTrigger((prev) => !prev);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Purchase Canceled Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            // Check if error.response exists before accessing its data property
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            Swal.fire({
                position: "center",
                icon: "error",
                title: errorMessage,
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const statusdelivery = async (paymentData, id) => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
      
          const rs = await axios.put(
            `http://localhost:8889/payment/statusdelivery/${id}`,
            paymentData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
      
          if (rs.status === 200) {
            setTrigger((prev) => !prev);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Purchase delivered successfully",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          console.error("Status delivery failed", error);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "An error occurred",
            text: error.message || "Please try again later.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      };
      

    return (
        <PaymentContext.Provider value={{ payment, createPayment,cancelPayment, setRefreshPayment,statusdelivery }}>
            {props.children}
        </PaymentContext.Provider>
    )
}

export default PaymentContext
export { PaymentContextProvider }