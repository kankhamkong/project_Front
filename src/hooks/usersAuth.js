import { useContext } from "react";
import UsersContext from "../contexts/UsersContext";

export default function usersAuth() {
    return useContext(UsersContext);
}