import { ReactNode } from "react";
import { Home, Users, Package } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 font-bold text-xl border-b">Admin Panel</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
          >
            <Home size={18} /> Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
          >
            <Users size={18} /> Users
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
          >
            <Package size={18} /> Products
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Admin</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
