import axios from "axios";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const navigate = useNavigate()
  const { setUser } = useAuth();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const hdlChange = (e) => {
    setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
  };

  const hdlRegister = () => {
    navigate('/register')
  }

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      // validation
      const rs = await axios.post("http://localhost:8889/auth/login", input);
      console.log(rs.data.token);
      localStorage.setItem("token", rs.data.token);
      const rs1 = await axios.get("http://localhost:8889/auth/me", {
        headers: { Authorization: `Bearer ${rs.data.token}` },
      });
      console.log(rs1.data);
      navigate('/')
      setUser(rs1.data);
      toast.success("Login สำเร็จ", {
        position: "top-center",
      });
    } catch (err) {
      console.log(err.message);
      toast.error("เกิดข้อผิดภาพคุณอาจะใส่ usernameหรือpassword ผิด", {
        position: "top-center",
      });
    }
  };

  return (
    <div
      className="hero min-h-screen"
      style={{ backgroundImage: "url(bt.jpg)" }}
    >
      <div className="login">
        <img
          src="/fairytall/Bear.png"
          alt="Example Image"
          width="200"
          height="200"
          className="image"
        />
        <div className="roto">Login</div>
        <form onSubmit={hdlSubmit}>
          <label>
            <input
              className="username px-2"
              type="text"
              placeholder="username"
              required
              name="username"
              value={input.username}
              onChange={hdlChange}
            />
          </label>

          <label>
            <input
              className="password px-2"
              type="password"
              placeholder="password"
              required
              name="password"
              value={input.password}
              onChange={hdlChange}
            />
          </label>

          <div className="submit">
            <button
              type="submit"
              className="text-white my-10 w-60 h-55 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Login
            </button>
          </div>     
          <div>
            <button
              onClick={hdlRegister}
              className="bb text-white w-40 h-50">
              Sing up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
