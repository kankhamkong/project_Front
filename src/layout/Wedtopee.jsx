import axios from "axios";
import React, {useContext,useEffect, useState } from "react";
import { Link } from 'react-router-dom';

export default function Wedtopee() {
  const id = location.pathname.split("/")[2];
  // console.log(id)
  const [get, setGet] = useState({});
  useEffect(() => {
    const book = async () => {
      let token = localStorage.getItem("token");
      const rs = await axios.get(`http://localhost:8889/book/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGet(rs.data.idbook);
    };
    book();
  }, []);

  


  return (
    <>
    <div className="hero min-h-screen bg-rose-900 flex justify-center items-center" >
      <div className="tap text-left">
        {get.length !== 0 ? (
          <div className="flex flex-col items-center py-20 ">
            <div className="flex items-center justify-center">
              <img src={get.image} width={210} height={150} alt="" />
              <div className="ml-4 text-white">
                <label className="block text-white text-4xl"> {get.title}</label>
                <label className="block text-white text-xl">author: {get.author}</label>
                <label className="block text-white text-xl"> {get.price}</label>
                <label className="block text-white text-xl">volume: {get.volume}</label>
                <div>
                <label className="block text-white text-xl"> {get.rate}</label>
                </div>
              </div>
            </div> 
            <div>
      <div>
        <Link to={`/sub`}><button>ซื้อ</button></Link>
      </div>
    </div>
          </div>
        ) : (
          <p className="text-white">ไม่พบข้อมูล</p>
        )}
      </div>
     
    </div>
    
  </>
  );
}
