import React from "react";
import paymentAuth from "../hooks/paymentAuth";

export default function HistoryUser() {
  const { payment } = paymentAuth();

  const convertStatus = (status) => {
    switch (status) {
      case 0:
        return "ยังไม่ชำระ";
      case 1:
        return "ชำระแล้ว";
      case 2:
        return "ยกเลิกการชำระ";
      default:
        return "Unknown";
    }
  };

  console.log(payment);

  return (
    <div className="bg-[#592828] min-h-screen pt-24 p-2">
      <div className="flex flex-col justify-center items-center my-[2rem]">
        <h2 className="text-3xl font-bold mb-8 text-white">
          ประวัติการสั่งซื้อทั้งหมด
        </h2>
        {payment && payment.length > 0 ? (
          <ul className="w-full max-w-4xl ">
            {payment
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((pmt) => (
                <li
                  key={pmt.id}
                  className="border p-6 mb-6 rounded-lg shadow-lg bg-white "
                >
                  <p className="text-xl font-semibold">
                    จำนวนเงินทั้งหมด: {pmt.totalPrice} THB
                  </p>
                  <p className="text-xl">จำนวน {pmt.totalQuantity} เล่ม</p>
                  <p className="text-xl">สถานะ: {convertStatus(pmt.status)}</p>
                  <p className="text-xl">
                    วันที่: {new Date(pmt.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xl">จ่ายด้วย: {pmt.method}</p>
                  <div>
                  <h3 className="text-2xl font-semibold mt-4">
                    ที่อยู่จัดส่ง
                  </h3>
                  <p className="text-xl ">ชื่อ-นามสกุล: {pmt.realname} {pmt.surname}</p>
                  <p className="text-xl">ที่อยู่: {pmt.address}</p>
                  <h3 className="text-2xl font-semibold mt-4">
                    รายละเอียดหนังสือ:
                  </h3>
                 
                  </div>
                  <div className="flex flex-row flex-wrap">
                    {pmt.Order?.order_details?.map((detail, index) => (
                      <div
                        key={index + 1}
                        className="flex flex-row items-start ml-6 mt-4"
                      >
                        {console.log(detail.order_id)}
                        <img
                          src={`${detail.book.image}`}
                          alt={detail.book.title}
                          className="w-40 h-60 object-cover"
                        />
                        <div className="ml-4 items-center">
                          <p className="text-lg mt-2">
                            ชื่อหนังสือ: {detail.book.title}
                          </p>
                          <p className="text-lg">เล่ม: {detail.book.volume}</p>
                          <p className="text-lg">ราคา: {detail.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-xl text-white">ไม่มีประวัติการชำระเงิน</p>
        )}
      </div>
    </div>
  );
}
