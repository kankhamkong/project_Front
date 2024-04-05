import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ProductContext from "../contexts/ProductContext";

export default function Books() {
  const {addbook} = useContext(ProductContext)
  const [input, setInput] = useState({
    title: "",
    author: "",
    price: "",
    volume: "",
    rate: "",
    image: "",
  });
  

 const hdladd = (e) => {
  e.preventDefault()
  addbook(input) 
  alert("Upload complete")
 }

 const hdlChange = (e) => {
  setInput((prv) => ({...prv, [e.target.name]: e.target.value }));
  // console.log(input);
 }


  return (
    <>
      <div className="hero min-h-screen bg-rose-900">
        <div className="bookdi">
          <a>เพิ่มหนังสือ</a>
          <div className="flex flex-col items-
left text-2xl">
            <a >title </a>
            <input className="block text-2xl" name="title" value={input.title} onChange={hdlChange}/>
            <a>author </a>
            <input className="block text-2xl" name="author" value={input.author} onChange={hdlChange} />
            <a>price </a>
            <input className="block text-2xl" name="price" value={input.price} onChange={hdlChange} />
            <a>volume</a>
            <input className="block text-2xl" name="volume" value={input.volume} onChange={hdlChange} />
            <a>rate </a>
            <input className="block text-2xl" name="rate" value={input.rate} onChange={hdlChange}/>
            <a>image </a>
            <input className="block text-2xl" name="image" value={input.image} onChange={hdlChange}/>

            <div className="flex flex-col items-
center">
            <button
              onClick={hdladd}
              className="text-white w-60 h-55 bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              UPLOAD
            </button>
          </div>

          </div>
        </div>
      </div>
    </>
  );
}
