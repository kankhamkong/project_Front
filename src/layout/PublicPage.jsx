import React from "react";
import { Link } from "react-router-dom";

export default function PublicPage() {
  return (
    <>
      <div
        className="bg-cover h-screen"
        style={{ backgroundImage: "url('bt4.png')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img src="fairytall/Bear.png" width={120} alt="log" />
            <Link to={`/login`}>
              <button
                type=""
                className="text-white w-20 h-10 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
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
              <button
                type=""
                className="text-white w-40 h-12 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xl text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                สมัครสมาชิก
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
