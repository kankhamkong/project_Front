import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LoginForm from "../layout/LoginForm";
import RegisterForm from "../layout/RegisterForm";
import useAuth from "../hooks/useAuth";
import Header from "../layout/Header";
import UserHome from "../layout/UserHome";
import Books from "../layout/Books";
import Wedtopee from "../layout/Wedtopee";
import Profileuser from "../layout/Profileuser";
import Pagbook from "../layout/Pagbook";
import Market from "../layout/Market";
import Order from "../layout/Order";
import Historyuser from "../layout/Historyuser";
import { PaymentContextProvider } from "../contexts/PaymentContext";
import Historyadmin from "../layout/Historyadmin";
import PageFound from "../layout/PageFound";
import Updatebook from "../layout/Updatebook";

const guestRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        {/* <Header /> */}
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <LoginForm /> },
      { path: "/register", element: <RegisterForm /> },
    ],
  },
  {
    path: '*',
    element: <><PageFound />,</>
  }
]);

const userRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <UserHome /> },
      { path: "/topee/*", element: <Wedtopee /> },
      { path: "/profile", element: <Profileuser /> },
      { path: "/market", element: <Market /> },
      {
        path: "/order",
        element: (
          <PaymentContextProvider>
            <Order />
          </PaymentContextProvider>
        ),
      },
      {
        path: "/history",
        element: (
          <PaymentContextProvider>
            <Historyuser />
          </PaymentContextProvider>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <><PageFound />,</>
  }
]);

const ADMINRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <UserHome /> },
      { path: "/Book", element: <Books /> },
      { path: "/topee/*", element: <Wedtopee /> },
      { path: "/profile", element: <Profileuser /> },
      { path: "/pag", element: <Pagbook /> },
      {path: "/historyadmin", element: <Historyadmin/> },
      {path: "/updatebook", element: <Updatebook/> },
    ],
  },
  {
    path: '*',
    element: <><PageFound />,</>
  }
]);



export default function AppRouter() {

  const { user } = useAuth();
  console.log(user?.role)
  const finalRouter = user?.id
    ? user.role === "ADMIN"
      ? ADMINRouter
      : userRouter
    : guestRouter;
  console.log(finalRouter)
  return <RouterProvider router={finalRouter} />;
}
