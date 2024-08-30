import { useContext } from "react";
import ProfileContext from "../contexts/ProfileContext";

export default function profileAuth() {
    return useContext(ProfileContext);
}