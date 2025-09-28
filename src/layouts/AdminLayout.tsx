import Dashboard from "@/pages/admin/Dashboard";
import User from "@/pages/admin/User";

const AdminLayout = () => {
  return (
    <div style={{backgroundColor: 'grey'}}>
      <Dashboard />
      <User />
    </div>
  )
}

export default AdminLayout

