import UserOverview from "./components/User";
import ProductOverview from "./components/Product";
import TabHistoryBar from "../components/TabHistoryBar";

function Analize() {
  return(
    <div className="w-full">
      <div className="flex columns-4 mt-3 ml-3 gap-2">
        <div className="w-100 items-center">
          <UserOverview />
        </div>
        <div className="w-100 items-center">
          <ProductOverview />
        </div>
      </div>
    </div>
  );
};

export default Analize;