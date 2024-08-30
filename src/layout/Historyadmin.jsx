import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PaymentHistoryAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [trigger, setTrigger] = useState(false); // State to trigger re-fetching data

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const rs = await axios.get('http://localhost:8889/payment/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sortedPayments = rs.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPayments(sortedPayments);
        console.log(sortedPayments);
      } catch (error) {
        console.error('Error fetching payment history:', error.message);
      }
    };

    fetchPayments();
  }, [trigger]); // Re-fetch data when 'trigger' changes

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusDeliveryChange = async (event, id) => {
    const statusdelovery = parseInt(event.target.value, 10);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const rs = await axios.put(`http://localhost:8889/payment/statusdelivery/${id}`, { statusdelovery }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (rs.status === 200) {
        setTrigger(prev => !prev); // Toggle trigger to re-fetch data
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Status updated successfully',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Status delivery update failed', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'An error occurred',
        text: error.message || 'Please try again later.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const filteredPayments = payments.filter(payment => 
    payment.user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    payment.user.id.toString().includes(searchTerm)
  );

  return (
    <div className="bg-[#592828] min-h-screen pt-24 p-2">
      <div className="max-w-[60rem] mx-auto mt-[3rem]">
        <h1 className="text-3xl font-bold mb-8 text-white">ข้อมูลการชำระสินค้าและการอัปเดตการส่งพัสดุ</h1>
        <input 
          type="text" 
          placeholder="ค้นหาด้วยชื่อผู้ใช้หรือ ID" 
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4 p-2 rounded bg-white"
        />
        {filteredPayments.length > 0 ? (
          <div>
            {filteredPayments.map((payment, index) => {
              const paymentStatusColor = getPaymentStatusColor(payment.status);
              const deliveryStatusColor = getDeliveryStatusColor(payment.statusdelovery);
              return (
                <div key={index} className="bg-white p-4 mb-4 rounded shadow">
                  <h2 className="text-xl font-semibold mb-2">ข้อมูลการสั่งซื้อ</h2>
                  <p className="text-base">ชื่อผู้ใช้: {payment.user.username}</p>
                  <p className="text-base">จำนวนเงินทั้งหมด: {payment.totalPrice} บาท</p>
                  <p className="text-base">จ่ายด้วย: {payment.method}</p>
                  <p className={`text-base ${paymentStatusColor}`}>สถานะการชำระ: {convertPaymentStatus(payment.status)}</p>
                  <p className="text-base">วันที่ชำระเงิน: {new Date(payment.createdAt).toLocaleDateString()}</p>
                  <p className={`text-base ${deliveryStatusColor}`}>สถานะการจัดส่ง: {convertDeliveryStatus(payment.statusdelovery)}</p>
                  <div className="mb-4">
                    <label htmlFor={`statusdelivery-${payment.id}`} className="block text-base font-semibold mb-2">สถานะการจัดส่ง:</label>
                    <select
                      id={`statusdelivery-${payment.id}`}
                      value={payment.statusdelovery}
                      onChange={(event) => handleStatusDeliveryChange(event, payment.id)}
                      className="p-2 rounded bg-white border border-gray-300"
                    >
                      <option value={0}>กำลังเตรียมจัดส่ง</option>
                      <option value={1}>นำส่งพัสดุแล้ว</option>
                      <option value={2}>นำจัดส่ง</option>
                      <option value={3}>จัดส่งสำเร็จ</option>
                      <option value={4}>ยกเลิกการสั่งซื้อ</option>
                    </select>
                  </div>
                  <hr className="my-4" />
                  <h2 className="text-xl font-semibold mb-2">รายละเอียดการจัดส่ง</h2>
                  <p className="text-base">ชื่อ-นามสกุล: {payment.realname} {payment.surname}</p>
                  <p className="text-base">ที่อยู่: {payment.address}</p>   
                  {payment.Order?.order_details?.map((detail, detailIndex) => (
                    <div key={detailIndex} className="bg-gray-200 p-2 mt-2 rounded">
                      <p className="text-base">ชื่อหนังสือ: {detail.book.title}</p>
                      <p className="text-base">เล่มที่: {detail.book.volume}</p>
                      <p className="text-base">จำนวน: {detail.quantity} เล่ม</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-white">ไม่มีประวัติการสั่งซื้อ</p>
        )}
      </div>
    </div>
  );
};

// Helper functions for status display

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'text-gray-400'; // Light gray
    case 1:
      return 'text-green-500'; // Green
    case 2:
      return 'text-red-500'; // Red
    default:
      return 'text-gray-400'; // Default color
  }
};

const getDeliveryStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'text-gray-400'; // Light gray
    case 1:
    case 2:
      return 'text-yellow-500'; // Yellow
    case 3:
      return 'text-green-500'; // Green
    case 4:
      return 'text-red-500'; // Red
    default:
      return 'text-gray-400'; // Default color
  }
};

const convertPaymentStatus = (status) => {
  switch (status) {
    case 0:
      return 'ยังไม่ชำระ';
    case 1:
      return 'ชำระแล้ว';
    case 2:
      return 'ยกเลิกการชำระ';
    default:
      return 'Unknown';
  }
};

const convertDeliveryStatus = (status) => {
  switch (status) {
    case 0:
      return 'กำลังเตรียมจัดส่ง';
    case 1:
      return 'นำส่งพัสดุแล้ว';
    case 2:
      return 'นำจัดส่ง';
    case 3:
      return 'จัดส่งสำเร็จ';
    case 4: 
      return 'ยกเลิกการสั่งซื้อ';
    default:
      return 'Unknown';
  }
};

export default PaymentHistoryAdmin;
