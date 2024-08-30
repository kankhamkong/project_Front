import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";

export default function ProfileUser() {
  const { user, logout } = useAuth();
  const { profile, updateProfile, addToProfile, setRefreshProfile } = useProfile();
  const [formData, setFormData] = useState({
    realname: "",
    lastname: "",
    gender: "",
    phone: "",
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (profile) {
      setFormData({
        realname: profile.realname || "",
        lastname: profile.lastname || "",
        gender: profile.gender !== undefined ? profile.gender.toString() : "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  // Refresh profile when user data changes
  useEffect(() => {
    if (userData) {
      setRefreshProfile((prev) => !prev);
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profile && profile.id) {
      await updateProfile(profile.id, formData);
    } else {
      await addToProfile(formData);
    }
    setIsEditing(false);
  };

  const hdlLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className="bg-[#592828] min-h-screen pt-24 p-2">
      <div className="max-w-[40rem] mx-auto my-[2rem] bg-white flex flex-col justify-center items-center rounded-md shadow-md p-5">
        <h1 className="text-2xl font-semibold mb-2">MyProfile</h1>
        <p className="mb-4">
          จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้
        </p>
        <hr className="w-full mb-4" />
        <div className="flex flex-row justify-between items-start w-full">
          <div className="flex flex-col items-start w-1/2">
            <p className="text-xl">ผู้ใช้: {user.username}</p>
            <p className="text-xl">Email: {user.email}</p>
            {user?.role !== "User" && (
              <Link>
                <p className="text-xl">{user.role}</p>
              </Link>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="w-full max-w-sm mt-5">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-xl mb-2"
                    htmlFor="realname"
                  >
                    ชื่อจริง :
                  </label>
                  <input
                    type="text"
                    id="realname"
                    name="realname"
                    value={formData.realname}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-xl mb-2"
                    htmlFor="lastname"
                  >
                    นามสกุล :
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-xl mb-2"
                    htmlFor="gender"
                  >
                    เพศ :
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="1">ชาย</option>
                    <option value="2">หญิง</option>
                    <option value="3">อื่นๆ</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-xl mb-2"
                    htmlFor="phone"
                  >
                    เบอร์โทร:
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                  >
                    {profile && profile.id ? "Save Changes" : "Create Profile"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5">
                <p className="text-xl">ชื่อจริง: {profile?.realname}</p>
                <p className="text-xl">นามสกุล: {profile?.lastname}</p>
                <p className="text-xl">
                  เพศ:{" "}
                  {profile?.gender === "1" || profile?.gender === 1
                    ? "ชาย"
                    : profile?.gender === "2" || profile?.gender === 2
                    ? "หญิง"
                    : profile?.gender === "3" || profile?.gender === 3
                    ? "อื่นๆ"
                    : "ไม่ระบุ"}
                </p>
                <p className="text-xl">เบอร์โทร: {profile?.phone}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full mt-4 focus:outline-none focus:shadow-outline"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center w-1/2">
            <img
              src="./img/user2.png"
              width={150}
              alt="User"
              className="mb-4"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center mt-5">
          {user?.role !== "ADMIN" && user?.role !== "DELIVERY" && (
            <Link to={`/address`} className="w-full">
              <button className="text-white w-[10rem] bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                เพิ่มที่อยู่
              </button>
            </Link>
          )}

          <button
            onClick={hdlLogout}
            className="text-white w-[10rem] bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-4 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
