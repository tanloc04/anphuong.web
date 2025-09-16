import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const FloatingPhoneButton = () => {
  return (
    <a
      href="tel:0123456789"
      className="fixed m-10 right-4 bottom-4 bg-[#c4a484] text-white p-5 rounded-full shadow-lg hover:bg-[#be8042] transition"
      style={{ zIndex: 9999 }}
    >
      <FontAwesomeIcon icon={faPhone} className="text-xl" />
    </a>
  );
};

export default FloatingPhoneButton;
