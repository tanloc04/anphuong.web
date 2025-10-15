import Sidebar from "./UserAnalize/components/Sidebar";
//import Analize from "./UserAnalize/layout"
import ProductManagement from "./ProductManagement/layout";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content">
        {/* <Analize /> */}
        <ProductManagement />
      </div>
    </div>
  )
}

export default Dashboard;
