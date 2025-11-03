import { Outlet } from "react-router-dom";
import Sidebar from "../pages/admin/components/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-zinc-950">
      <Sidebar />   
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </main>
      
    </div>
  )
}

export default AdminLayout;