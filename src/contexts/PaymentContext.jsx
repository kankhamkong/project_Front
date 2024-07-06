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
                const rs = await axios.get(`http://localhost:8889/payment/payment`, {
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

    const cancelPayment = async (paymentData) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return
            await axios.post('http://localhost:8889/payment/cancel', { paymentData }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setTrigger(prv => !prv))
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Purchase Success",
                showConfirmButton: false,
                timer: 1500
            })

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

    return (
        <PaymentContext.Provider value={{ payment, createPayment,cancelPayment, setRefreshPayment }}>
            {props.children}
        </PaymentContext.Provider>
    )
}

export default PaymentContext
export { PaymentContextProvider }