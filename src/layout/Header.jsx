import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import cartAuth from "../hooks/cartAuth";
import ProductContext from "../contexts/ProductContext";

const userNav = [
  { to: "/", text: "Home" },
];

const adminNav = [
  { to: "/", text: "Home" },
  { to: "/addbook", text: "AddBook" },
  { to: "/remove", text: "Book" },
  { to: "/historyadmin", text: "HistoryOrder" },
];

const guestNav = [{ to: "/", text: "Home" }];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { user, logout } = useAuth();
  const { cart } = cartAuth();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const finalNav = user?.id
    ? user.role === "ADMIN"
      ? adminNav
      : userNav
    : guestNav;

  const hdlLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setShowDropdown(true);
  };

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
      setShowUserMenu(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const totalQuantity = cart?.reduce((acc, item) => acc + item.quantity, 0);
  
  return (
    <div
      className={`w-full top-0 fixed z-40 transition duration-500 ${
        isScrolled ? "backdrop-blur-md" : ""
      }`}
    >
      <div>
        <div className="px-4 md:px-8 py-1 flex items-center transition duration-500 bt-zinc-900 bg-opacity-60 bg-[#323232] opacity-57 shadow-md xl:shadow-xl">
          <img
            className="h-20 lg:h7"
            src="/fairytall/Bear.png"
            alt="logo"
            onClick={() => navigate(`/`)}
          />

          <div className="flex-1 relative">
            <div className="flex items-center relative">
              <div className="absolute top-2 left-3">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </div>
            <label>
              <input
                className="m-1 py-[0.25rem] px-[2rem] rounded-full border border-gray-500"
                type="text"
                placeholder="Search..."
                required
                name="Search"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
            </label>
            {showDropdown && searchInput && (
              <div
                ref={dropdownRef}
                className="absolute bg-white text-black mt-1 w-full rounded-lg shadow-lg z-50"
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/topee/${product.id}`}
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => {
                        handleDropdownClose();
                        handleClearSearch();
                      }}
                    >
                      {product.title}เล่ม{product.volume}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2">No products found</div>
                )}
              </div>
            )}
          </div>
          <div className="flex-none justify-end text-white">
            <ul className="menu menu-horizontal px-2">
              {finalNav.map((el) => (
                <li key={el.to}>
                  <Link
                    to={el.to}
                    className="text-white hover:text-gray-300 focus:text-gray-300"
                    style={{ color: el.visited ? "#ccc" : "white" }}
                  >
                    {el.text}
                  </Link>
                </li>
              ))}
              {user?.id && (
                <li>
                  <div className="relative" ref={userMenuRef}>
                    <img src="img/user.png" width={20} alt="" />
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="text-white hover:text-gray-300 focus:text-gray-300 flex items-center"
                    >
                      {user.username}
                    </button>
                    {showUserMenu && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-[#3e1e1e] text-white rounded-lg shadow-lg z-50 w-48 my-[-13rem]">
                        <Link
                          to="/profile"
                          className=" px-4 py-2 hover:bg-[#522929] flex flex-col justify-center items-center"
                        >
                          MyProfile
                          <img src="img/user.png" width={60} alt="" />
                          <p>{user.username}</p>
                          <p>{user.email}</p>
                        </Link>
                        {user?.role !== "ADMIN" &&<Link
                          to="/history"
                          className="px-4 py-2 hover:bg-[#522929] flex flex-col justify-center items-center"
                        >
                          ประวัติการสั่งซื้อ
                        </Link>}
                        <button
                          onClick={hdlLogout}
                          className="w-full text-left px-4 py-2 hover:bg-[#522929] flex flex-col justify-center items-center"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              )}
            </ul>
            <div className="btn btn-ghost text-200 py-1.5 px-4">
              <Link
                to="/market"
                className="text-white hover:text-gray-300 focus:text-gray-300"
              >
                {user?.role !== "ADMIN" && (
                  <FontAwesomeIcon icon={faCartShopping} />
                )}
                {user?.role !== "ADMIN" && <span>{totalQuantity}</span>}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
