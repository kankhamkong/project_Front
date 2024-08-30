import axios from 'axios'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: '', 
    password: '',
    confirmPassword: '',
    email: '',
    Roles: 'User'
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

      const rs = await axios.post('http://localhost:8889/auth/register', input);
      console.log(rs);
      if (rs.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ', // Updated text to Thai
          text: 'สมัครสมาชิกเรียบร้อยแล้ว', // Updated text to Thai
        }).then(() => {
          navigate('/login');
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
    <div className="hero min-h-screen" style={{ backgroundImage: "url(img/bt.jpg)" }}>
      <div className="login1">
        <div className="sing_up">Sing Up</div>
        <form onSubmit={hdlSubmit} className="flex flex-col gap-6 items-center">
          <label>
            <input
              className="usernamerg px-2"
              type="text"
              placeholder='username'
              required
              name="username"
              value={input.username}
              onChange={hdlChange}
            />
          </label>

          <label>
            <input 
              className="email px-2"
              type="email"
              placeholder='email'
              required
              name="email"
              value={input.email}
              onChange={hdlChange}
            />
          </label>

          <label>
            <input
              className="passwordrg px-2"
              type="password"
              placeholder='password'
              required
              name="password"
              value={input.password}
              onChange={hdlChange}
            />
          </label>
          <label>
            <input
              className="passwordrg1 px-2"
              type="password"
              placeholder='confirmPassword'
              required
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={hdlChange}
            />
          </label>
          
          <button type="submit" className="text-white w-40 h-10 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Create account</button>
        </form>
      </div>
    </div>
  );
}
