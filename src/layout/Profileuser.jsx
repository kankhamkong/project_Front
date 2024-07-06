import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Navigate } from "react-router-dom";

export default function ProfileUser() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const run = async () => {
      try {
        let token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const rs = await axios.get("http://localhost:8889/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(rs.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  const hdlLogout = () => {
    logout();
    navigate("/"); // Navigate to the home page after logout
  };

  return (
    <div className="bg-[#592828] min-h-screen pt-24 p-2">
      <div className="max-w-[30rem] mx-auto my-[2rem] bg-white flex flex-col justify-center items-center rounded-md shadow-md">
        <h1 className="text-2xl font-semibold">MyProfile</h1>
        <p>จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้</p>
        <hr />
        <div className="m-3 flex flex-col justify-center items-center">
          <img src="../img/user.png" width={100} alt="" />
          <p className="text-xl">ผู้ใช้: {user.username}</p>
          <p className="text-xl">Email: {user.email}</p>
          {user?.role !== "ADMIN" && (
            <Link to={`/history`}>
              <button
                className="text-white w-50 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-0 mt-5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                ดูประวัติการสั่งซื้อ
              </button>
            </Link>
          )}
          <button
            onClick={hdlLogout}
            className="text-white w-50 h-30 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center ml-0 mt-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
