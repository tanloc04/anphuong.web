import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Login from "../pages/Login/components/Login";
import Register from "@/pages/Register/components/Register";
import AccountConfirmation from "@/pages/Register/components/AccountConfirmation";
import NotFound from "../pages/NotFound";
import AboutUs from "../pages/AboutUs";
import Product from "../pages/Product";
import News from "../pages/News";

import Dashboard from "../pages/admin/Dashboard";
import ProductManagement from "@/pages/admin/ProductManagement/components/ProductManagement";
// import Users from "../pages/admin/UserManagement/page";
import AdminRoute from "./AdminRoute";
import CateManagement from "@/pages/admin/CategoryManagement/components/CateManagement";
import Overview from "@/pages/admin/Overview/components/Overview";
import HomeConfiguration from "@/pages/admin/Settings/components/HomeConfiguration";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "account/login", element: <Login /> },
      { path: "account/register", element: <Register /> },
      { path: "account/confirmation/:id", element: <AccountConfirmation />},
      { path: "pages/about-us", element: <AboutUs /> },
      { path: "pages/product", element: <Product /> },
      { path: "pages/news", element: <News /> }
    ],
  },

  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "overview", element: <Overview /> },
      
          { path: "products", element: <ProductManagement /> },
        
          // { path: "users", element: <Users /> },
        
          { path: "categories", element: <CateManagement /> },

          { path: "settings", element:  <HomeConfiguration />}
        ]
      }
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);