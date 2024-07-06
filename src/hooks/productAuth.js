import { useContext } from "react";
import ProductContext from "../contexts/ProductContext";

export default function productAuth() {
    return useContext(ProductContext);
}