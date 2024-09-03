import React, { useState } from "react";
import orderAuth from "../hooks/orderAuth";
import paymentAuth from "../hooks/paymentAuth";
import cartAuth from "../hooks/cartAuth";
import addressAuth from "../hooks/addressAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcMastercard, faCcVisa, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { faBuildingColumns, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

export default function Order() {
  const { order, orderDetail, setOrder, setOrderDetail } = orderAuth();
  const { createPayment, setRefreshPayment } = paymentAuth();
  const { setRefreshCart } = cartAuth();
  const { addresses } = addressAuth(); // Get addresses from addressAuth

  const [paymentMethod, setPaymentMethodState] = useState("");
  const [selectedAddress, setSelectedAddress] = useState({});
  const navigate = useNavigate();

  const totalQuantity = orderDetail.reduce((total, detail) => total + detail.quantity, 0);

  const handleSelectPaymentMethod = (event) => {
    setPaymentMethodState(event.target.value);
  };

  const handleAddressChange = (event) => {
    const selectedAddr = addresses?.find(addr => addr.id == event.target.value);
    setSelectedAddress(selectedAddr);
  };

  const handlePayment = async () => {
    if (!paymentMethod || !selectedAddress) {
      Swal.fire({
        title: "กรุณาเลือกวิธีการชำระเงินและที่อยู่",
        text: "คุณต้องเลือกวิธีการชำระเงินและที่อยู่ก่อนทำรายการ",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return; // Add return to prevent further execution if not valid
    }

    const userIds = localStorage.getItem('userId');
    const paymentData = {
      userId: userIds,
      totalQuantity: totalQuantity,
      orderId: order.id,
      totalPrice: order.total_price,
      method: paymentMethod,
      addrssId: selectedAddress.id,
      statusdescription: " ",
    };
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:8889/payment/payment', paymentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        title: "สำเร็จ!",
        text: "การชำระเงินเสร็จสิ้น",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      navigate("/history");
      window.location.reload();
    } catch (error) {
      console.error("Payment failed", error);
      Swal.fire({
        title: "ล้มเหลว",
        text: "การชำระเงินล้มเหลว",
        icon: "error",
        confirmButtonText: "ลองอีกครั้ง",
      });
    }
  };

  const isFormValid = paymentMethod && selectedAddress;

  return (
    <div className="max-w-[100rem] bg-white flex justify-center items-center">
      <div className="mx-auto p-4 my-28">
        <div className="flex flex-col justify-center items-center">
          <div className="my-4">
            <h1 className="text-3xl">ชำระเงิน</h1>
          </div>
          <div>
            {order.length === 0 ? (
              <p>ไม่มีสินค้าในตระกร้า</p> /* No items in the cart */
            ) : (
              <div className="grid grid-cols-2 gap-5 w-full">
                <div className="w-[25rem] bg-[#ffffff] border rounded-lg p-3">
                  <h1 className="text-2xl">เลือกวิธีการชำระเงิน</h1>
                  <div>
                    {/* Payment Methods */}
                    <div className="flex gap-2 border-[1px] p-2 rounded-lg border-dark-blue mt-2">
                      <input
                        type="radio"
                        name="method"
                        value="bank_account"
                        onChange={handleSelectPaymentMethod}
                      />
                      <span>
                        Bank Account{" "}
                        <FontAwesomeIcon icon={faBuildingColumns} />
                      </span>
                    </div>
                    <div className="flex gap-2 border-[1px] p-2 rounded-lg border-dark-blue items-center">
                      <input
                        type="radio"
                        name="method"
                        value="credit_card"
                        onChange={handleSelectPaymentMethod}
                      />
                      <span>
                        Debit Card / Credit Card{" "}
                        <FontAwesomeIcon icon={faCcMastercard} className="pr-1" />
                        <FontAwesomeIcon icon={faCreditCard} className="pr-1" />
                        <FontAwesomeIcon icon={faCcVisa} className="pr-1" />
                      </span>
                    </div>
                    <div className="flex gap-2 border-[1px] p-2 rounded-lg border-dark-blue">
                      <input
                        type="radio"
                        name="method"
                        value="paypal"
                        onChange={handleSelectPaymentMethod}
                      />
                      <span>
                        PayPal <FontAwesomeIcon icon={faPaypal} />
                      </span>
                    </div>
                    {/* Address Selection */}
                    <div className="w-full flex flex-col mb-4">
                      <h2 className="text-xl mb-2">เลือกที่อยู่</h2>
                      <select
                        name="address"
                        value={selectedAddress?.id || ""}
                        onChange={handleAddressChange}
                        className="border p-2 mb-2 rounded w-full"
                        required
                      >
                        <option value="">เลือกที่อยู่</option>
                        {addresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.address}, {address.district}, {address.province} {address.postcode}
                          </option>
                        ))}
                      </select>
                      {/* Display Selected Address Details */}
                      {selectedAddress.id && (
                        <div className="border p-2 mt-2 rounded bg-gray-100">
                          <p><strong>ชื่อ:</strong>{selectedAddress.realname}</p>นามสกุล:<p><strong></strong>{selectedAddress.surname}</p>
                          <p><strong>ที่อยู่:</strong> {selectedAddress.address}</p>
                          <p><strong>เขต:</strong> {selectedAddress.district}</p>
                          <p><strong>จังหวัด:</strong> {selectedAddress.province}</p>
                          <p><strong>รหัสไปรษณีย์:</strong> {selectedAddress.postcode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Order Summary and Payment Button */}
                <div className="flex flex-col gap-2 w-[25rem]">
                  <div className="border p-2 rounded-md bg-[#EDEDED]">
                    <div className="flex justify-between border-b border-black/20 pb-2 mb-3">
                      <p>สรุปรายการหนังสือที่สังซื้อ</p>
                      <p>จำนวน {totalQuantity} รายการ</p>
                    </div>
                    {orderDetail.map((detail, index) => (
                      <div key={index} className="flex justify-between px-2">
                        <p>
                          {index + 1}. {detail?.book?.title} เล่ม {detail?.book?.volume}
                        </p>
                        <p>จำนวน {detail?.quantity} เล่ม</p>
                        <p>{detail?.amount} THB</p>
                      </div>
                    ))}
                  </div>
                  <div className="border p-2 rounded-md flex-col flex items-center justify-center gap-2">
                    <p>ยอดเงิน {order?.total_price} THB</p>
                    <button
                      className="bg-[#06ef15] w-1/2 py-1.5 rounded-full text-white disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handlePayment}
                      disabled={!isFormValid}
                    >
                      ชำระเงิน
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
