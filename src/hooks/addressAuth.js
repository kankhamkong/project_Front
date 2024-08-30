import { useContext } from "react";
import AddressContext from "../contexts/AddressContext";

export default function useAddressAuth() {
    return useContext(AddressContext);
}
