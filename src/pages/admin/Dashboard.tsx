import Sidebar from "./Sidebar";
import Product from "./ProductManagement/components/Product";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content">
        <Product />
      </div>
    </div>
  )
}

export default Dashboard;
