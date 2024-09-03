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
      } catch (error) {
        console.error('Error fetching payment history:', error.message);
      }
    };

    fetchPayments();
  }, [trigger]);

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
        setTrigger(prev => !prev);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'อัปเดตสถานะสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error updating delivery status:', error.message);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถอัปเดตสถานะได้',
        showConfirmButton: true
      });
    }
  };

  const getFilteredPayments = () => {
    if (!searchTerm) return payments;
    return payments.filter(payment =>
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const convertStatus = (status) => {
    switch (status) {
      case 0:
        return { text: 'ยังไม่ชำระ', color: 'text-gray-400' };
      case 1:
        return { text: 'ชำระแล้ว', color: 'text-green-500' };
      case 2:
        return { text: 'ยกเลิกการชำระ', color: 'text-red-500' };
      default:
        return { text: 'ไม่ทราบ', color: 'text-gray-400' };
    }
  };

  const convertStatusdelovery = (statusdelovery) => {
    switch (statusdelovery) {
      case 0:
        return { text: 'กำลังเตรียมจัดส่ง', color: 'text-gray-500' };
      case 1:
        return { text: 'นำส่งพัสดุแล้ว', color: 'text-yellow-500' };
      case 2:
        return { text: 'นำจัดส่ง', color: 'text-yellow-500' };
      case 3:
        return { text: 'จัดส่งสำเร็จแล้ว', color: 'text-green-500' };
      case 4:
        return { text: 'คำสั่งถูกยกเลิก', color: 'text-red-500' };
      default:
        return { text: 'ไม่ทราบ', color: 'text-gray-400' };
    }
  };

  return (
    <div className="bg-[#592828] min-h-screen pt-24 p-2">
      <div className="flex flex-col justify-center items-center my-[2rem]">
        <h2 className="text-3xl font-bold mb-8 text-white">รายการ การจัดส่ง</h2>
        <input
          type="text"
          placeholder="ค้นหาด้วย ID การชำระเงิน"
          className="p-2 mb-4 w-[55rem] justify-start"
          onChange={handleSearch}
        />
        {getFilteredPayments().length > 0 ? (
          <ul className="w-full max-w-4xl">
            {getFilteredPayments().map(pmt => {
              const statusInfo = convertStatus(pmt.status);
              const deliveryStatusInfo = convertStatusdelovery(pmt.statusdelovery);
              return (
                <li key={pmt.id} className="border p-6 mb-6 rounded-lg shadow-lg bg-white">
                  <p className="text-xl font-semibold">
                    จำนวนเงินทั้งหมด: {pmt.totalPrice} THB
                  </p>
                  <p className="text-xl">จำนวน {pmt.totalQuantity} เล่ม</p>
                  <p className={`text-xl ${statusInfo.color}`}>สถานะ: {statusInfo.text}</p>
                  <p className="text-xl">
                    วันที่: {new Date(pmt.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xl">จ่ายด้วย: {pmt.method}</p>

                  {/* เพิ่มรายละเอียดการจัดส่ง */}
                  <div>
                    <h3 className="text-2xl font-semibold mt-4">รายละเอียดการจัดส่ง</h3>
                    <p className="text-xl">ชื่อ-นามสกุล: {pmt.addrss?.realname} {pmt.addrss?.surname}</p>
                    <p className="text-xl">เบอร์โทร: {pmt.addrss?.phone}</p>
                    <p className="text-xl">ที่อยู่: {pmt.addrss?.address}</p>
                    <p className="text-xl">อำเภอ: {pmt.addrss?.district}</p>
                    <p className="text-xl">จังหวัด: {pmt.addrss?.province}</p>
                    <p className="text-xl">รหัสไปรษณีย์: {pmt.addrss?.postcode}</p>
                    <p className={`text-xl ${deliveryStatusInfo.color}`}>สถานะการจัดส่ง: {deliveryStatusInfo.text}</p>
                    {pmt.status === 2 && pmt.statusdescription && (
                      <p className="text-xl text-red-500 mt-2">สาเหตุการยกเลิก: {pmt.statusdescription}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-row flex-wrap">
                    {pmt.Order?.order_details?.map((detail, index) => (
                      <div key={index} className="flex flex-row items-start ml-6 mt-4">
                        <img
                          src={`${detail.book.image}`}
                          alt={detail.book.title}
                          className="w-40 h-60 object-cover"
                        />
                        <div className="ml-4 items-center">
                          <p className="text-lg mt-2">ชื่อหนังสือ: {detail.book.title}</p>
                          <p className="text-lg">เล่ม: {detail.book.volume}</p>
                          <p className="text-lg">ราคา: {detail.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-row items-center mt-4">
                    <label htmlFor={`status-${pmt.id}`} className="mr-4 text-xl">สถานะการจัดส่ง:</label>
                    <select
                      id={`status-${pmt.id}`}
                      className="p-2 border rounded"
                      value={pmt.statusdelovery}
                      onChange={(e) => handleStatusDeliveryChange(e, pmt.id)}
                    >
                      <option value={0}>กำลังเตรียมจัดส่ง</option>
                      <option value={1}>นำส่งพัสดุแล้ว</option>
                      <option value={2}>นำจัดส่ง</option>
                      <option value={3}>จัดส่งสำเร็จแล้ว</option>
                      <option value={4}>คำสั่งถูกยกเลิก</option>
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-xl text-white">ไม่มีข้อมูลการชำระเงิน</p>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryAdmin;
