import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { ProgressSpinner } from "primereact/progressspinner";

const AdminRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const adminEmail = import.meta.env.VITE_ALLOWED_EMAILS;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="4"
        />
      </div>
    );
  }

  if (!isAuthenticated || !user || user.email !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
