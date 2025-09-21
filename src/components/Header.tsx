import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faBars,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import SearchBox from "./ui/SearchBox";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-white/50 backdrop-blur-md shadow-sm z-50">
      {/* Logo */}
      <Link
        to="/home"
        className="text-2xl font-montserrat-extrabold text-gray-900"
      >
        An Phương
      </Link>

      {/* Menu desktop */}
      <nav className="hidden md:block ml-50">
        <ul className="flex space-x-8 font-montserrat-medium">
          <li>
            <Link
              to="/pages/product"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link
              to="/pages/about-us"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Về chúng tôi
            </Link>
          </li>
          <li>
            <Link
              to="/pages/news"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Tin tức
            </Link>
          </li>
          <li
              className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
              onClick={() => {
                document.getElementById("footer")?.scrollIntoView({
                  behavior: "smooth", 
                  block: "start",     
                });
              }}
            >
              Liên hệ
          </li>
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

        <Link to="/account/login">
          <FontAwesomeIcon
            icon={faUser}
            className="text-xl text-gray-800 cursor-pointer hover:text-black transition"
          />
        </Link>
        <Link to="/cart">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-xl text-gray-800 cursor-pointer hover:text-black transition"
          />
        </Link>
        {/* Hamburger */}
        <button
          className="md:hidden text-2xl text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden">
          <div className="p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                autoFocus
                className="w-19/20 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#c4a484]"
              />
            </div>

            <ul className="flex flex-col space-y-4 font-montserrat-medium">
              <li>
                <Link
                  to="/pages/product"
                  className="text-gray-700 hover:text-black transition"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/about-us"
                  className="text-gray-700 hover:text-black transition"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}                
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/news"
                  className="text-gray-700 hover:text-black transition"
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                >
                  Tin tức
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.getElementById("footer")?.scrollIntoView({
                      behavior: "smooth", 
                      block: "start",     
                    });
                  }}
                  className="text-gray-700 hover:text-black transition"
                >
                  Liên hệ
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
