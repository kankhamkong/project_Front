import React, { useState } from "react";
import { Link } from "react-router-dom";
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";
import { Splide, SplideSlide } from "@splidejs/react-splide";

export default function PublicPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="bg-cover h-screen"
        style={{ backgroundImage: "url('img/bt4.png')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img src="fairytall/Bear.png" width={120} alt="log" />
            <Link to={`/login`}>
              <button className="text-white w-20 h-10 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                เข้าสู่ระบบ
              </button>
            </Link>
          </div>
          <div className="flex flex-col justify-center items-center my-20 text-center">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl">
              หนังสือการ์ตูนญี่ปุ่นที่ไม่จำกัดและถูกลิขสิทธ์
            </h1>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl my-4">
              แนวการ์ตูนอีกมากที่พร้อมให้คุณได้สั่งซื้อ
            </h1>
            <h3 className="text-white text-xl sm:text-2xl my-8">
              หากต้องการเข้าใช้เว็บและคุณยังไม่มีบัญชีสามารถสมัครได้ที่ปุ่มนี้
            </h3>
            <Link to={`/register`}>
              <button className="text-white w-40 h-12 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xl text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                สมัครสมาชิก
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[#522929] h-[45rem] pt-24 p-2 border-y-8 border-[#7a6b6b]">
        <h1 className="text-white text-3xl flex flex-col items-center">
          หนังสือการ์ตูนญี่ปุ่นที่อัพล่าสุดวันนี้
        </h1>
        <div className="flex flex-col justify-center items-center my-8">
          <Splide
            options={{
              type: "loop",
              perPage: 3,
              perMove: 1,
              autoplay: true,
              gap: "0.5rem",
              pagination: true,
            }}
            className="w-11/12"
          >
            {[
              "/manga/9781593072520.jpg",
              "/manga/6000050279_front_XXL.jpg",
              "/manga/6000048587_front_XXL.jpg",
              "/manga/6000046330_front_XXL.jpg",
              "/manga/1000271082_front_XXL.jpg",
              "/manga/1000267030_front_XXL.jpg",
              "/manga/1000264094_front_XXL.jpg",
              "/manga/315977727_677881983705383_1692415075895593811_n.jpg",
              "/manga/1000226853_front_XXL.jpg",
            ].map((src, index) => (
              <SplideSlide key={index}>
                <div className="text-white p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
                  <img
                    src={src}
                    width={300}
                    alt=""
                    className="h-[30rem] w-[20rem] mx-auto cursor-pointer"
                    onClick={handleImageClick}
                  />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      </div>
      <div className="bg-[#522929] h-[20rem] pt-2 p-2">
        <div className="">
          <img
            src="manga/—Pngtree—delivery man send package_6421163.png"
            width={300}
            alt=""
            className="flex flex-col justify-center items-center ms-[23rem]"
          />
        </div>
         <h1 className="text-white text-2xl text-center ms-[7rem] my-[-8rem]">
            รับประกันส่งสินค้าที่ถึงที่หมาย แน่นอน!!
          </h1>
      </div>
      <div className="bg-[#000000] h-[5rem] pt-2 p-2">
      <h1 className="text-white text-base flex flex-col justify-center text-center items-center">
            *จัดทำโดย รหัสนักศึกษา 64102105109 นาย กัญจน์ คำคง ปี4 สาขา วิทยาการคอมพิวเตอร์* 
          </h1>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">
              คุณยังไม่ได้ login หรือเป็นสมาชิก
            </h2>
            <div className="flex justify-around">
              <Link to="/login">
                <button className="text-white py-2 px-4 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xl text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="text-white py-2 px-4 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xl text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                  Register
                </button>
              </Link>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-black"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
}
