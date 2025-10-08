import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ backgroundColor: 'grey' }}>
      <div className="flex-1 p-4">
        <Outlet /> {/* MỌI TRANG CON hiển thị ở đây */}
      </div>
    </div>
  );
};

export default AdminLayout;
