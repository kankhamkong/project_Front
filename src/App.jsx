import React from "react";
import useAuth from "./hooks/useAuth";
import AppRouter from "./routes/AppRouter";
import { CartContextProvider } from "./contexts/CartContext";
import { OrderContextProvider } from "./contexts/OrderContext";
import { ProductContextProvider } from "./contexts/ProductContext"; // Import ProductContextProvider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PaymentContextProvider } from "./contexts/PaymentContext";
import { ProfileContextProvider } from "./contexts/ProfileContext";
import { AddressContextProvider } from "./contexts/AddressContext";
import { UsersContextProvider } from "./contexts/UsersContext";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg">Load...</span>;
      </div>
    );
  }

  return (
    <CartContextProvider>
      <OrderContextProvider>
        <UsersContextProvider>
        <AddressContextProvider>
        <PaymentContextProvider>
        <ProfileContextProvider>
        <ProductContextProvider>
          {" "}
          {/* Wrap ProductContextProvider */}
          <ToastContainer />
          <AppRouter />
        </ProductContextProvider>
        </ProfileContextProvider>
        </PaymentContextProvider>
        </AddressContextProvider>
        </UsersContextProvider>
      </OrderContextProvider>
    </CartContextProvider>
  );
}

export default App;
