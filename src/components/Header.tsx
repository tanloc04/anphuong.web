import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser, faBars, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import SearchBox from "./ui/SearchBox";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-white/50 backdrop-blur-md shadow-sm z-50">
      {/* Logo */}
      <div className="text-2xl font-montserrat-extrabold text-gray-900">An Phương</div>

      {/* Menu desktop */}
      <nav className="hidden md:block ml-50">
        <ul className="flex space-x-8 font-montserrat-medium">
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer transition">Sản phẩm</li>
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer transition">Về chúng tôi</li>
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer transition">Tin tức</li>
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer transition">Liên hệ</li>
        </ul>
      </nav>

      {/* Right icons */}
      <div className="flex items-center space-x-5">
        {/* Desktop search */}
        <div className="hidden md:block relative w-72 mb-10">
          <div className="absolute right-0">
            <SearchBox />
          </div>
        </div>

        {/* Mobile search icon */}
        <button
          className="md:hidden text-xl text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>

        <FontAwesomeIcon
          icon={faUser}
          className="text-xl text-gray-800 cursor-pointer hover:text-black transition"
        />
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="text-xl text-gray-800 cursor-pointer hover:text-black transition"
        />

        {/* Hamburger */}
        <button
          className="md:hidden text-2xl text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {(isMenuOpen ) && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
          <div className="p-6">
            { (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  autoFocus
                  className="w-19/20 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#c4a484]"
                />
              </div>
            )}
            {isMenuOpen && (
              <ul className="flex flex-col space-y-4 font-montserrat-medium">
                <li className="text-gray-700 hover:text-black cursor-pointer transition">Sản phẩm</li>
                <li className="text-gray-700 hover:text-black cursor-pointer transition">Dự án</li>
                <li className="text-gray-700 hover:text-black cursor-pointer transition">Về chúng tôi</li>
                <li className="text-gray-700 hover:text-black cursor-pointer transition">Tin tức</li>
                <li className="text-gray-700 hover:text-black cursor-pointer transition">Liên hệ</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;