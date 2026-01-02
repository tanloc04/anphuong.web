import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import { AuthProvider } from "@/context/auth.context";
import Home from "@/pages/components/Home";
import Login from "@/pages/Auth/components/Login";
import Register from "@/pages/Auth/components/Register";
import AccountConfirmation from "@/pages/Auth/components/AccountConfirmation";
import UserProfile from "@/pages/Auth/components/UserProfile";
import NotFound from "@/pages/components/NotFound";
import AboutUs from "@/pages/components/AboutUs";
import News from "@/pages/components/News";
import Dashboard from "@/pages/components/Dashboard";
import ProductManagement from "@/pages/Admin/Product/ProductManagement";
import AdminRoute from "./AdminRoute";
import CategoryManagement from "@/pages/Admin/Category/CategoryManagement";
import Overview from "@/pages/Admin/Overview/components/Overview";
import HomeConfiguration from "@/pages/Admin/Settings/components/HomeConfiguration";

const AppRoot = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <AppRoot />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "home", element: <Home /> },
          { path: "account/login", element: <Login /> },
          { path: "account/register", element: <Register /> },
          { path: "account/confirmation/:id", element: <AccountConfirmation />},
          { path: "account/profile", element:  <UserProfile />},
          { path: "pages/about-us", element: <AboutUs /> },
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
              { path: "categories", element: <CategoryManagement /> },
              { path: "settings", element:  <HomeConfiguration />}
            ]
          }
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ]
  }
]);