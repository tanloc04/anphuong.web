import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import AboutUs from "../pages/AboutUs";
import Product from "../pages/Product";
import News from "../pages/News";

import Dashboard from "../pages/admin/Dashboard";
import ProductList from "../pages/admin/ProductManagement/page";
// import Users from "../pages/admin/UserManagement/page";
import AnalyticsOverview from "../pages/admin/Analize/page";
import AnalyticsReports from "../pages/admin/Analize/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "account/login", element: <Login /> },
      { path: "pages/about-us", element: <AboutUs /> },
      { path: "pages/product", element: <Product /> },
      { path: "pages/news", element: <News /> }
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      
      { path: "products", element: <ProductList /> },
      
      // { path: "users", element: <Users /> },
      
      { path: "overview", element: <AnalyticsOverview /> },
      
      { path: "reports", element: <AnalyticsReports /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);