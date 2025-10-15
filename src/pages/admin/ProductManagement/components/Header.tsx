import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Header = () => {

  const handleAdd = () => {
    alert('proccess to productpage...');
  }

  return (
    <div className="flex rounded-sm justify-around items-center w-300 h-20 bg-violet-600">
        <h1 className="text-xl text-white font-semibold">PRODUCT MANAGEMENT</h1>
        <Button
          onClick={handleAdd}
          icon={<FontAwesomeIcon icon={faPlus} />}
          disabled={false}
          className="cursor-pointer"            
        >
          Add
        </Button>
        
    </div>
  )
}

export default Header