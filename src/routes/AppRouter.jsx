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
import TypeUser from "../layout/TypeUser";
import Regsiterdelovery from "../layout/Regsiterdelovery";
import Bookauthor from "../layout/Bookauthor";
import AddressForm from "../layout/AddressForm";
import Usersadmin from "../layout/Usersadmin";



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
      { path: "/topee/*", element: <Wedtopee/> },
      { path: "/bookauthor", element: <Bookauthor/>},
      { path: "/profile", element: <Profileuser /> },
      { path: "/type", element: <TypeUser/>},
      { path: "/market", element: <Market /> },
      { path: "/address", element: <AddressForm/>},
      {
        path: "/order/*",
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
      { path: "/users", element: <Usersadmin/>},
      // { path: "/historyadmin", element: <Historyadmin /> },
      { path: "/registerdelovery", element: <Regsiterdelovery/>},
      { path: "/bookauthor", element: <Bookauthor/>},
    ],
  },
  {
    path: '*',
    element: <PageFound />,
  }
]);

const DeliveryRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      { index: true, element: <Historyadmin/> },
      { path: "/profile", element: <Profileuser/> },
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
      : user.role === "DELIVERY"
      ? DeliveryRouter
      : userRouter
    : guestRouter;
  console.log(finalRouter)
  return <RouterProvider router={finalRouter} />;
}
