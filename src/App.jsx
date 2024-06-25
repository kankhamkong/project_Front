import React from "react";
import useAuth from "./hooks/useAuth";
import AppRouter from "./routes/AppRouter";
import { CartContextProvider } from "./contexts/CartContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <p className="text-4xl text-primary">Loading..</p>
    );
  }

  const notify = () => {
    toast("Wow so easy!");
    toast.success("Success Notification!", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000
    });
    toast.error("Error Notification!", {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 5000
    });
    toast.info("Info Notification!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: false
    });
    toast.warn("Warning Notification!", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 8000
    });
  };

  return (
    
    <CartContextProvider> 
      <ToastContainer />
        <AppRouter />
    </CartContextProvider>
  );
}

export default App;