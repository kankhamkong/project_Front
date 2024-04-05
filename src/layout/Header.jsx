import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const guestNav = [
  { to: "/", text: "Login" },
  { to: "/register", text: "Sing Up" },
];

const userNav = [
  { to: "/", text: "Home" },
  { to: "/make", text: "Make"}
  // { to: "/Book", text: "Book" }
];

const adminNav = [
  { to: "/", text: "Home" },
  { to: "/Book", text: "Book" },
  { to: "/pag", text: "PagBook"},
];

export default function Header() {
  const { user, logout } = useAuth();
  const finalNav = user?.id
    ? user.Roles === "ADMIN"
      ? adminNav
      : userNav
    : guestNav;

  const navigate = useNavigate();

  const hdlLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full fixed z-40">
      <div>
        <div
          className="
    px-4
    md:px-8
    py-1
    flex
    items-center
    transition
    duration-500
    bt-zinc-900
    bg-opacity-50
    bg-gray-500 opacity-57
    shadow-md xl:shadow-xl
    "
        >
          <img className="h-20 lg:h7" src="Bear.png" alt="logo" />
          <div className="flex-1">
            <label>
              <input
                className="Search"
                type="text"
                placeholder="Search..."
                required
                name="Search"
              />
            </label>
          </div>
          <div className="flex-none justify-end">
            <ul className="c menu menu-horizontal px-1">
              {finalNav.map((el) => (
                <li key={el.to}>
                  <Link to={el.to}>{el.text}</Link>
                </li>
              ))}
              {user?.id && (
                <li>
                  <Link to="#" onClick={hdlLogout}>
                    Logout
                  </Link>
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
          </div>
        </div>
      </div>
    </div>
  );
}
