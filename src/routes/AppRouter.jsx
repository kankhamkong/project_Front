import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import LoginForm from '../layout/LoginForm'
import RegisterForm from '../layout/RegisterForm'
import useAuth from '../hooks/useAuth'
import Header from '../layout/Header'
import UserHome from '../layout/UserHome'
import Wedmanga from '../layout/Wedmanga'
import Books from '../layout/Books'
import Wedtopee from '../layout/Wedtopee'
import Profileuser from '../layout/Profileuser'
import Pagbook from '../layout/Pagbook'
import Market from '../layout/Market'


const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      {/* <Header /> */}
      <Outlet />
    </>,
    children: [
      { index: true, element: <LoginForm /> },
      { path: '/register', element: <RegisterForm />}
    ]
  }
])

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children : [
      { index: true, element: <UserHome /> },
      { path: '/Wed', element: <Wedmanga/>},
      { path: '/topee/*', element: <Wedtopee/>},
      { path: '/profile', element: <Profileuser/>},
      { path: '/market', element: <Market/>}

      
     
      
      
    ]
  }
])

const ADMINRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children : [
      { index: true, element: <UserHome /> },
      { path: '/Wed', element: <Wedmanga/>},
      { path: '/Book', element: <Books/>},
      { path: '/topee/*', element: <Wedtopee/>},
      { path: '/profile', element: <Profileuser/>},
      { path: '/pag', element: <Pagbook/>},
      
    ]
  }
])

export default function AppRouter() {
  const {user} = useAuth() 
  const finalRouter = user?.id ? (user.Roles === "ADMIN" ? ADMINRouter: userRouter ): guestRouter
  return (
    <RouterProvider router={finalRouter} />
  )
}
