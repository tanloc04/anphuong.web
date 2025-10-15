import UserOverview from "../UserAnalize/components/User"
import ProductOverview from "./components/Product";

function Analize() {
  return(
    <div className="flex columns-4 mt-3 ml-3 gap-2">
      <div className="w-100 items-center">
        <UserOverview />
      </div>
      <div className="w-100 items-center">
        <ProductOverview />
      </div>
    </div>
  );
}

export default Analize;