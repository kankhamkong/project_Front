import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentHistoryAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
        console.log(error.message);
      }
    };

    fetchPayments();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPayments = payments.filter(payment => 
    payment.user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    payment.user.id.toString().includes(searchTerm)
  );

  return (
    <div className="bg-[#592828] min-h-screen  pt-24 p-2">
      <div className='max-w-[60rem] mx-auto my-22'>
        <h1 className='text-3xl font-bold mb-8 text-white'>History Order</h1>
        <input 
          type="text" 
          placeholder="Search by username&ID" 
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4 p-2 rounded"
        />
        {filteredPayments.length > 0 ? (
          <div>
            {filteredPayments.map((payment, index) => (
              <div key={index} className="bg-white p-4 mb-2 rounded shadow">
                <h2 className='text-xl font-semibold'>ข้อมูลของ order</h2>
                <p className="text-base">Username: {payment.user.username}</p>
                <p className="text-base">จำนวนเงินทั้งสิ้น: {payment.totalPrice} บาท </p>
                <p className="text-base">จ่ายด้วย {payment.method}</p>
                <p className="text-base">สถานะการชำระ: {payment.status === 1 ? 'ชำระแล้ว' : 'ยกเลิก'}</p>
                <p className="text-base">วันที่ชำระเงิน: {new Date(payment.createdAt).toLocaleDateString()}</p>
                <hr />
                <h2 className='text-xl font-semibold'>รายละเอียดในการจัดส่ง</h2>
                <p className="text-base">ชื่อนามสกุล: {payment.realname} {payment.surname}</p>
                <p className="text-base">ที่อยู่ที่จะจัดส่ง: {payment.address}</p>   
                {payment.Order.order_details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="bg-gray-200 p-2 mt-2 rounded">
                    <p>ชื่อหนังสือ: {detail.book.title}</p>
                    <p>เล่มที่: {detail.book.volume}</p>
                    <p>จำนวน: {detail.quantity} เล่ม</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">No payment history available.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryAdmin;
