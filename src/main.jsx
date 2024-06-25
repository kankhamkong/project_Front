import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import { ProductContextProvider } from "./contexts/ProductContext.jsx";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ProductContextProvider>
        <ToastContainer position="top-center" />
        <App />
      </ProductContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
