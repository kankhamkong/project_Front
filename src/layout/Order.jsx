import React, { useEffect, useState } from "react";
import orderAuth from "../hooks/orderAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import paymentAuth from "../hooks/paymentAuth";
import { faCcMastercard } from "@fortawesome/free-brands-svg-icons/faCcMastercard";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons/faBuildingColumns";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faCcVisa, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import cartAuth from "../hooks/cartAuth";

export default function Order() {
  const { order, orderDetail, setOrder, setOrderDetail } = orderAuth();
  const { createPayment,  } = paymentAuth();
  const [paymentMethod, setPaymentMethodState] = useState("");
  const navigate = useNavigate();
  const { setRefreshPayment } = paymentAuth();
  const { setRefreshCart } = cartAuth();

  const [form, setForm] = useState({
    realname: "",
    surname: "",
    houseNumber: "",
    district: "",
    province: "",
    postalCode: "",
  });

  useEffect(() => {

  }, [order]);

  const totalQuantity = orderDetail.reduce(
    (total, detail) => total + detail.quantity,
    0
  );

  const handleSelectPaymentMethod = (event) => {
    const selectedMethod = event.target.value;
    setPaymentMethodState(selectedMethod);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      Swal.fire({
        title: "กรุณาเลือกวิธีการชำระเงิน",
        text: "คุณต้องเลือกวิธีการชำระเงินก่อนทำรายการ",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    try {
      const paymentData = {
        totalQuantity: totalQuantity,
        orderId: order.id,
        totalAmount: order.total_price,
        method: paymentMethod,
        address: `${form.houseNumber}, ${form.district}, ${form.province} ${form.postalCode}`, // Concatenate the address fields
        realname: form.realname,
        surname: form.surname,
      };
      console.log(paymentData);
      await createPayment(paymentData);
      // Success message
      Swal.fire({
        title: "สำเร็จ!",
        text: "การชำระเงินเสร็จสิ้น",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
      // Navigate to /history after successful payment
      navigate("/history");
      setRefreshPayment((prev) => !prev);
      setRefreshCart((prev) => !prev);
      setOrder([]);
      setOrderDetail([]);
    } catch (error) {
      console.error("Payment failed", error);
      // Error message
      Swal.fire({
        title: "ล้มเหลว",
        text: "การชำระเงินล้มเหลว",
        icon: "error",
        confirmButtonText: "ลองอีกครั้ง",
      });
    }
  };

  // const handleCancelPayment = async () => {
  //   try {
  //     const paymentData = {
  //       totalQuantity: totalQuantity,
  //       orderId: order.id,
  //       totalAmount: order.total_price,
  //       method: paymentMethod,
  //       address: `${form.houseNumber}, ${form.district}, ${form.province} ${form.postalCode}`, // Concatenate the address fields
  //       realname: form.realname,
  //       surname: form.surname,
  //     };
      
  //     await cancelPayment(paymentData);
  //     // Success message
  //     Swal.fire({
  //       title: "สำเร็จ!",
  //       text: "ยกเลิกการชำระสินค้าเสร็จสิ้น",
  //       icon: "success",
  //       confirmButtonText: "ตกลง",
  //     });
  //     // Navigate to /history after successful cancellation
  //     navigate("/history");
  //     setRefreshPayment((prev) => !prev);
  //     setRefreshCart((prev) => !prev);
  //   } catch (error) {
  //     console.error("Cancellation failed", error);
  //     // Error message
  //     Swal.fire({
  //       title: "ล้มเหลว",
  //       text: "ยกเลิกการชำระสินค้าล้มเหลว",
  //       icon: "error",
  //       confirmButtonText: "ลองอีกครั้ง",
  //     });
  //   }
  // };

  const isFormValid = form.realname && form.surname && form.houseNumber && form.district && form.province && form.postalCode && paymentMethod;

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
                    <div className="flex gap-2 border-[1px] p-2 rounded-lg border-dark-blue mt-2">
                      <input
                        type="radio"
                        name="method"
                        value="bank_account"
                        onChange={handleSelectPaymentMethod}
                      />
                      <span>
                        Bank Account{" "}
                        <i className="fa-solid fa-building-columns">
                          <FontAwesomeIcon icon={faBuildingColumns} />
                        </i>
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
                        <i className="pr-1">
                          <FontAwesomeIcon icon={faCcMastercard} />
                        </i>
                        <i className="pr-1">
                          <FontAwesomeIcon icon={faCreditCard} />
                        </i>
                        <i className="pr-1">
                          <FontAwesomeIcon icon={faCcVisa} />
                        </i>
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
                        PayPal{" "}
                        <i className="">
                          <FontAwesomeIcon icon={faPaypal} />
                        </i>
                      </span>
                    </div>
                    <div className="w-full flex flex-col mb-4">
                      <h2 className="text-xl mb-2">ข้อมูลผู้ซื้อ</h2>
                      <input
                        type="text"
                        name="realname"
                        value={form.realname}
                        onChange={handleInputChange}
                        placeholder="ชื่อจริง"
                        className="border p-2 mb-2 rounded w-full"
                      />
                      <input
                        type="text"
                        name="surname"
                        value={form.surname}
                        onChange={handleInputChange}
                        placeholder="นามสกุล"
                        className="border p-2 mb-2 rounded w-full"
                      />
                      <input
                        type="text"
                        name="houseNumber"
                        value={form.houseNumber}
                        onChange={handleInputChange}
                        placeholder="บ้านเลขที่"
                        className="border p-2 mb-2 rounded w-full"
                      />
                      <input
                        type="text"
                        name="district"
                        value={form.district}
                        onChange={handleInputChange}
                        placeholder="ตำบล/อำเภอ"
                        className="border p-2 mb-2 rounded w-full"
                      />
                      <input
                        type="text"
                        name="province"
                        value={form.province}
                        onChange={handleInputChange}
                        placeholder="จังหวัด"
                        className="border p-2 mb-2 rounded w-full"
                      />
                      <input
                        type="text"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleInputChange}
                        placeholder="รหัสไปรษณีย์"
                        className="border p-2 mb-2 rounded w-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-[25rem]">
                  <div className="border p-2 rounded-md bg-[#EDEDED]">
                    <div className="flex justify-between border-b border-black/20 pb-2 mb-3">
                      <p>สรุปรายการหนังสือที่สังซื้อ</p>
                      <p>จำนวน {totalQuantity} รายการ</p>
                    </div>
                    {orderDetail.map((detail, index) => (
                      <div key={index} className="flex justify-between px-2">
                        <div className="flex justify-between">
                          <p>
                            {index + 1} {detail?.book?.title} เล่ม{" "}
                            {detail?.book?.volume}
                          </p>
                        </div>
                        <div>
                          <p className="">จำนวน {detail?.quantity} เล่ม</p>
                        </div>
                        <div>
                          <p>{detail?.amount} THB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border p-2 rounded-md flex-col flex items-center justify-center gap-2">
                    <p>ยอดเงิน {order?.total_price} THB</p>
                    <div className="w-full flex justify-center">
                      <button
                        className="bg-[#06ef15] w-1/2 py-1.5 rounded-full text-white disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handlePayment}
                        disabled={order.length === 0 || !isFormValid}
                      >
                        ชำระเงิน
                      </button>
                    </div>
                    {/* <div className="w-full flex justify-center">
                      <button
                        className="bg-[#F24444] w-1/2 py-1.5 rounded-full text-white disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleCancelPayment}
                        disabled={order.length === 0}
                      >
                        ยกเลิกการชำระ
                      </button>
                    </div> */}
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
