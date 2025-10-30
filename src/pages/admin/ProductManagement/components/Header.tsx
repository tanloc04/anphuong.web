import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import Button from "../../components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from 'primereact/button';

const Header = () => {

  const handleAdd = () => {
    alert('proccess to productpage...');
  }

  return (
    <div className="flex rounded-sm justify-around items-center w-[1000px] h-20 bg-gray-300 border-2">
        <h1 className="text-xl text-black font-semibold">PRODUCT MANAGEMENT</h1>
        {/* <Button
          onClick={handleAdd}
          icon={<FontAwesomeIcon icon={faPlus} />}
          disabled={false}
          className="cursor-pointer"            
        >
          Add
        </Button> */}

        <Button onClick={handleAdd} icon={<FontAwesomeIcon icon={faPlus} />} severity="info"/>
    </div>
  )
}

export default Header