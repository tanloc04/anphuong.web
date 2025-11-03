import Analize from "./Analize/page";
import ProductManagement from "./ProductManagement/page";

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="main-content w-full">
        <Analize />
        {/* <ProductManagement /> */}
      </div>
    </div>
  );
};

export default Dashboard;
