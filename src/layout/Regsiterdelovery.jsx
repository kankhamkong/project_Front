import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Regsiterdelovery() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    Roles: 'DELIVERY'
  });

  const hdlChange = e => {
    setInput(prv => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async e => {
    try {
      e.preventDefault();
      // Validation
      if (input.password !== input.confirmPassword) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'กรุณาตรวจสอบการยืนยันรหัสผ่านอีกครั้ง', // Updated text to Thai
        });
      }

      const rs = await axios.post('http://localhost:8889/auth/registerdelivery', input);
      console.log(rs);
      if (rs.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ', // Updated text to Thai
          text: 'สมัครสมาชิกเรียบร้อยแล้ว', // Updated text to Thai
        }).then(() => {
          navigate('/');
        });
      }
    } catch (err) {
      console.log(err.message);
      
      if (err.response && err.response.status === 500) {
        // Handle duplicate username or email error
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด', // Updated text to Thai
          text: 'ดูเหมือนว่าบัญชีนี้มีอยู่แล้ว กรุณาใช้ชื่อผู้ใช้หรืออีเมลอื่น', // Updated text to Thai
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      }
    }
  };

  return (
    <div>
      <div className="bg-[#592828] min-h-screen pt-24 p-2">
        <div className='max-w-[60rem] mx-auto my-2 grid justify-center'>
          <h1 className='flex flex-col text-3xl font-bold my-8 text-white items-center'>สมัครพนักงานส่งของ</h1>
          <div className='flex flex-col items-center justify-center bg-[#d3d3d3] w-[25rem] h-[26rem]'> 
            <form onSubmit={hdlSubmit} className="flex flex-col gap-6 items-center">
              <div className="flex flex-col items-left text-xl gap-1">
                <p>Username</p>
                <label>
                  <input
                    className="block text-xl rounded-md shadow-md px-2 w-[20rem]"
                    type="text"
                    placeholder='username'
                    required
                    name="username"
                    value={input.username}
                    onChange={hdlChange}
                  />
                </label>
                <p>Email</p>
                <label>
                  <input 
                    className="block text-xl rounded-md shadow-md px-2 w-[20rem]"
                    type="email"
                    placeholder='email'
                    required
                    name="email"
                    value={input.email}
                    onChange={hdlChange}
                  />
                </label>
                <p>Password</p>
                <label>
                  <input
                    className="block text-xl rounded-md shadow-md px-2 w-[20rem]"
                    type="password"
                    placeholder='password'
                    required
                    name="password"
                    value={input.password}
                    onChange={hdlChange}
                  />
                </label>
                <p>Confirm Password</p>
                <label>
                  <input
                    className="block text-xl rounded-md shadow-md px-2 w-[20rem]"
                    type="password"
                    placeholder='confirmPassword'
                    required
                    name="confirmPassword"
                    value={input.confirmPassword}
                    onChange={hdlChange}
                  />
                </label>
              </div>
              <button type="submit" className="text-white w-40 h-10 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Create account</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
