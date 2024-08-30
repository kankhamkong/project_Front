import React from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function PageFound() {
  const { user } = useAuth();
  const navigate = useNavigate();
  document.title = '404 Not Found';

  const hdlBack = () => {
    user?.user_id ? navigate(-1) : navigate('/');
  };

  return (
    <div
      className="bg-cover h-screen flex items-center justify-center"
      style={{
        backgroundImage:  "url(img/bt3.png)" ,
      }}
    >
      <div className="text-center">
        <div className=" flex flex-col justify-center items-center mr-1 top-5">
          <img
          className='flex flex-col justify-center items-center'
            src="./fairytall/Bear.png"
            width={200}
            alt="Logo" 
          />
        </div>
        <div className='flex flex-col justify-center items-center'>
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl mt-4 text-white">Not Found</h2>
          <p className="mt-2 text-white">The requested URL was not found on this server.</p>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={hdlBack}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
