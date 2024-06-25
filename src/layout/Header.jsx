import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import cartAuth from "../hooks/cartAuth"; // Import cartAuth

const userNav = [
  { to: "/", text: "Home" },
  // { to: "/market", text: <FontAwesomeIcon icon={faCartShopping} /> }
];

const adminNav = [
  { to: "/", text: "Home" },
  { to: "/Book", text: "Book" },
  { to: "/pag", text: "PagBook" },
];

const guestNav = [
  { to: "/", text: "Home" }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { setRefreshCart, cart } = cartAuth(); // Get setRefreshCart from cartAuth
  const navigate = useNavigate();

  const finalNav = user?.id
    ? user.Roles === "ADMIN"
      ? adminNav
      : userNav
    : guestNav;

  const hdlLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Example: Update cart count in header when cart changes
    // You can replace this with logic that suits your CartContext implementation
    //setRefreshCart();
  }, [cart, setRefreshCart]);

  return (
    <div className={`w-full top-0 fixed z-40 transition duration-500 ${isScrolled ? "backdrop-blur-md" : ""}`}>
      <div>
        <div className="px-4 md:px-8 py-1 flex items-center transition duration-500 bt-zinc-900 bg-opacity-50 bg-gray-500 opacity-57 shadow-md xl:shadow-xl">
          <img className="h-20 lg:h7" src="/fairytall/Bear.png" alt="logo" />
          <div className="flex-1">
            <label>
              <input className="m-1 py-[0.25rem] px-[2rem] rounded-full border border-gray-500" type="text" placeholder="Search..." required name="Search" />
            </label>
          </div>
          <div className="flex-none justify-end">
            <ul className="menu menu-horizontal px-2">
              {finalNav.map((el) => (
                <li key={el.to}>
                  <Link to={el.to}>{el.text}</Link>
                </li>
              ))}
              {user?.id && (
                <li>
                  <Link to="#" onClick={hdlLogout}>Logout</Link>
                </li>
              )}
            </ul>
            <div className="btn btn-ghost text-200 py-1.5 px-4">
              {user?.id ? (
                <Link to={`/profile/`}>{user.username}</Link>
              ) : (
                "Guest"
              )}
            </div>
            <div className="btn btn-ghost text-200 py-1.5 px-4">
              <Link to="/market">
                <FontAwesomeIcon icon={faCartShopping} />
                <span>{cart.length}</span> {/* Display cart count */}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
