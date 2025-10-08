import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";   
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import AboutUs from "../pages/AboutUs";
import Product from "../pages/Product";
import News from "../pages/News";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "@/pages/admin/UserManagement/UserManagement";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/account/login", element: <Login /> },
      { path: "/pages/about-us", element: <AboutUs /> },
      { path: "/pages/product", element: <Product /> },
      { path: "/pages/news", element: <News /> }
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },         // /admin
      { path: "users", element: <UserManagement /> },  // /admin/users
    ],
  },

  {
    path: "*",
    element: <NotFound />, 
  },
]);
