import React from "react";
import useAuth from "./hooks/useAuth";
import AppRouter from "./routes/AppRouter";
import { CartContextProvider } from "./contexts/CartContext";
import { OrderContextProvider } from "./contexts/OrderContext";
import { ProductContextProvider } from "./contexts/ProductContext"; // Import ProductContextProvider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <p className="text-4xl text-primary">Loading..</p>;
  }

  return (
    <CartContextProvider>
      <OrderContextProvider>
        <ProductContextProvider> {/* Wrap ProductContextProvider */}
          <ToastContainer />
          <AppRouter />
        </ProductContextProvider>
      </OrderContextProvider>
    </CartContextProvider>
  );
}

export default App;
