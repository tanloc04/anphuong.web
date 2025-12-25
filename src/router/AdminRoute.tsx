import { Navigate, Outlet } from "react-router-dom"
import { Toast } from "primereact/toast";
import { useRef } from "react";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");
  const toast = useRef<Toast>(null);

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  if (!token) {
    return <Navigate to="/account/login" replace/>;
  }

  if (userEmail !== adminEmail) {
    toast.current?.show({ severity: "warn", summary: "Cảnh báo", detail: "Bạn không có quyền truy cập vào trang này!" });
    return <Navigate to="/" replace/>
  }

  return <Outlet />
};

export default AdminRoute;