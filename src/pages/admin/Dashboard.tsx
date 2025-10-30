import Sidebar from "./UserAnalize/components/Sidebar";
//import Analize from "./UserAnalize/layout"
//import ProductManagement from "./ProductManagement/page";
import CreateProduct from "./ProductManagement/forms/CreateProductForm";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content">
        {/* <Analize /> */}
        {/* <ProductManagement /> */}
        <CreateProduct />
      </div>
    </div>
  )
}

export default Dashboard;
