import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import paymentAuth from "../hooks/paymentAuth";

export default function HistoryUser() {
  const navigate = useNavigate();
  const { payment, cancelPayment } = paymentAuth();
  const [refreshPayment, setRefreshPayment] = useState(false);
  const [refreshCart, setRefreshCart] = useState(false);

  // window.location.reload();

  const handleCancelPayment = async (id) => {
    try {
      if (!id) {
        return alert("Invalid payment ID");
      }

      // Prompt user for cancellation reason
      const { value: reason } = await Swal.fire({
        title: "เหตุผลการยกเลิก",
        input: "textarea",
        inputLabel: "กรุณาใส่เหตุผลการยกเลิก",
        inputPlaceholder: "เหตุผลการยกเลิกการชำระเงิน...",
        inputAttributes: {
          "aria-label": "เหตุผลการยกเลิก",
        },
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ยืนยัน",
        inputValidator: (value) => {
          if (!value) {
            return "กรุณาใส่เหตุผล";
          }
        },
      });

      // If the user did not cancel the prompt
      if (reason !== undefined) {
        const paymentData = {
          status: 2, // Set status to 2 for canceled payment
          statusdelovery: 4, // Set statusdelovery to 4
          statusdescription: reason, // Add reason to the payment data
        };

        await cancelPayment(paymentData, id);

        Swal.fire({
          title: "สำเร็จ!",
          text: "ยกเลิกการชำระสินค้าเสร็จสิ้น",
          icon: "success",
          confirmButtonText: "ตกลง",
        });

        navigate("/history", { replace: true });
        setRefreshPayment((prev) => !prev);
        setRefreshCart((prev) => !prev);
      }
    } catch (error) {
      console.error("Cancellation failed", error);
      Swal.fire({
        title: "ล้มเหลว",
        text: "ยกเลิกการชำระสินค้าล้มเหลว",
        icon: "error",
        confirmButtonText: "ลองอีกครั้ง",
      });
    }
  };

  const convertStatus = (status) => {
    switch (status) {
      case 0:
        return { text: "ยังไม่ชำระ", color: "text-gray-400" };
      case 1:
        return { text: "ชำระแล้ว", color: "text-green-500" };
      case 2:
        return { text: "ยกเลิกการชำระ", color: "text-red-500" };
      default:
        return { text: "Unknown", color: "text-gray-400" };
    }
  };

  const convertStatusdelovery = (statusdelovery) => {
    switch (statusdelovery) {
      case 0:
        return { text: "กำลังเตรียมจัดส่ง", color: "text-gray-500" };
      case 1:
        return { text: "นำส่งพัสดุแล้ว", color: "text-yellow-500" };
      case 2:
        return { text: "นำจัดส่ง", color: "text-yellow-500" };
      case 3:
        return { text: "จัดส่งสำเร็จแล้ว", color: "text-green-500" };
      case 4:
        return { text: "คำสั่งถูกยกเลิก", color: "text-red-500" };
      default:
        return { text: "Unknown", color: "text-gray-400" };
    }
  };

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
              .map((pmt) => {
                const statusInfo = convertStatus(pmt.status);
                const deliveryStatusInfo = convertStatusdelovery(pmt.statusdelovery);
                return (
                  <li
                    key={pmt.id}
                    className="border p-6 mb-6 rounded-lg shadow-lg bg-white"
                  >
                    <p className="text-xl font-semibold">
                      จำนวนเงินทั้งหมด: {pmt.totalPrice} THB
                    </p>
                    <p className="text-xl">จำนวน {pmt.totalQuantity} เล่ม</p>
                    <p className={`text-xl ${statusInfo.color}`}>สถานะ: {statusInfo.text}</p>
                    {pmt.status === 2 && pmt.statusdescription && (
                      <p className="text-xl text-red-500">เหตุผลที่ยกเลิก: {pmt.statusdescription}</p>
                    )}
                    <p className="text-xl">
                      วันที่: {new Date(pmt.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xl">จ่ายด้วย: {pmt.method}</p>
                    <div>
                      <h3 className="text-2xl font-semibold mt-4">
                        ที่อยู่จัดส่ง
                      </h3>
                      <p className="text-xl">ชื่อ-นามสกุล: {pmt.addrss?.realname} {pmt.addrss?.surname}</p>
                      <p className="text-xl">เบอร์โทร: {pmt.addrss?.phone}</p>
                      <p className="text-xl">ที่อยู่: {pmt.addrss?.address}</p>
                      <p className="text-xl">อำเภอ: {pmt.addrss?.district}</p>
                      <p className="text-xl">จัดหวัด: {pmt.addrss?.province}</p>
                      <p className="text-xl">รหัสไปรษณีย์: {pmt.addrss?.postcode}</p>
                      <p className={`text-xl ${deliveryStatusInfo.color}`}>สถานะการจัดส่ง: {deliveryStatusInfo.text}</p>
                      <h3 className="text-2xl font-semibold mt-4">
                        รายละเอียดหนังสือ:
                      </h3>
                    </div>
                    <div className="flex flex-row flex-wrap">
                      {pmt.Order?.order_details?.map((detail, index) => (
                        <div
                          key={index}
                          className="flex flex-row items-start ml-6 mt-4"
                        >
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
                    <div className="w-full flex justify-center">
                      <button
                        className="bg-[#F24444] w-[8rem] h-[3rem] rounded-full text-white disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleCancelPayment(pmt.id)}
                        disabled={pmt.status !== 1 || pmt.statusdelovery > 0}
                      >
                        ยกเลิกการชำระ
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : (
          <p className="text-xl text-white">ไม่มีประวัติการชำระเงิน</p>
        )}
      </div>
    </div>
  );
}
