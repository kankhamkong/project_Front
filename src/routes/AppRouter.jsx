import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LoginForm from "../layout/LoginForm";
import RegisterForm from "../layout/RegisterForm";
import useAuth from "../hooks/useAuth";
import Header from "../layout/Header";
import UserHome from "../layout/UserHome";
import Addbooks from "../layout/Addbooks";
import Wedtopee from "../layout/Wedtopee";
import Profileuser from "../layout/Profileuser";
import Removebook from "../layout/Removebook";
import Market from "../layout/Market";
import Order from "../layout/Order";
import Historyuser from "../layout/Historyuser";
import { PaymentContextProvider } from "../contexts/PaymentContext";
import Historyadmin from "../layout/Historyadmin";
import PageFound from "../layout/PageFound";
import PublicPage from "../layout/PublicPage"; // เพิ่มหน้าใหม่ที่ทุกคนเข้าถึงได้

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
      { index: true, element: <PublicPage /> }, // เปลี่ยนหน้าแรกเป็น PublicPage
      { path: "/login", element: <LoginForm /> }, // เปลี่ยน path ของ LoginForm เป็น /login
      { path: "/register", element: <RegisterForm /> },
    ],
  },
  {
    path: '*',
    element: <PageFound />,
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
      { path: "/topee/", element: <Wedtopee/> },
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
    element: <PageFound />,
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
      { path: "/addbook", element: <Addbooks/> },
      { path: "/topee/*", element: <Wedtopee/> },
      { path: "/profile", element: <Profileuser /> },
      { path: "/remove", element: <Removebook /> },
      { path: "/historyadmin", element: <Historyadmin /> },
    ],
  },
  {
    path: '*',
    element: <PageFound />,
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
