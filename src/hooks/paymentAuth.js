import { useContext } from "react";
import PaymentContext from "../contexts/PaymentContext";

export default function paymentAuth() { 
    return useContext(PaymentContext)
}