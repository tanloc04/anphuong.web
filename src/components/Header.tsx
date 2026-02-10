import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faBars,
  faTimes,
  faSearch,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "./ui/SearchBox";
import { useAuth } from "@/context/auth.context";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();
  
  const displayUsername = user?.username || localStorage.getItem('username') || user?.email;
  const isLoggedIn = isAuthenticated || !!localStorage.getItem('token');

  const handleLogout = () => {
      logout();
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
        <Link
          to="/home"
          className="text-xl md:text-2xl font-montserrat-extrabold text-gray-900 shrink-0"
        >
          An Phương
        </Link>
        <nav className="hidden md:flex flex-1 justify-center px-4">
          <ul className="flex items-center space-x-4 lg:space-x-8 font-montserrat-medium text-sm lg:text-base">
            <li>
              <Link
                to="/pages/product"
                className="text-gray-600 hover:text-gray-900 transition whitespace-nowrap"
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                to="/pages/about-us"
                className="text-gray-600 hover:text-gray-900 transition whitespace-nowrap"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                to="/pages/news"
                className="text-gray-600 hover:text-gray-900 transition whitespace-nowrap"
              >
                Tin tức
              </Link>
            </li>
            <li
              className="text-gray-600 hover:text-gray-900 transition cursor-pointer whitespace-nowrap"
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
        <div className="flex items-center space-x-3 lg:space-x-5 shrink-0">
          <div className="hidden lg:block">
             <SearchBox />
          </div>
          <button
            className="lg:hidden text-lg text-gray-600 hover:text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <div className="flex items-center gap-2 lg:gap-3">        
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/account/profile"
                  className="flex flex-col items-center group"
                >
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faUser}
                      className="text-lg lg:text-xl text-blue-600 cursor-pointer group-hover:text-blue-800 transition"
                    />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2 lg:h-3 lg:w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 lg:h-3 lg:w-3 bg-green-500"></span>
                    </span>
                  </div>
                  <span className="hidden xl:block text-xs font-semibold text-gray-700 mt-1 group-hover:text-black max-w-[100px] truncate">
                    {displayUsername}
                  </span>
                </Link>
                <button 
                  className="text-gray-400 hover:text-red-500 transition ml-1"
                  onClick={handleLogout}
                  title="Đăng xuất"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-sm lg:text-base"/>
                </button>
              </div>
            ) : (
              <Link to="/account/login" className="flex flex-col items-center text-gray-600 hover:text-black transition">
                <FontAwesomeIcon 
                  icon={faUser}
                  className="text-lg lg:text-xl cursor-pointer"
                />
                <span className="hidden lg:block text-xs mt-1 whitespace-nowrap"></span>
              </Link>
            )}
          </div>
          <Link to="/cart" className="relative group">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-lg lg:text-xl text-gray-600 group-hover:text-black transition"
            />
          </Link>
          <button
            className="md:hidden text-xl text-gray-800 ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden border-t border-gray-100 animate-fade-in-down">
          <div className="p-6 flex flex-col gap-4">
            <div className="relative">
               <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-[#c4a484] text-sm"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            </div>

            <ul className="flex flex-col space-y-4 font-montserrat-medium text-gray-700">
              <li>
                <Link
                  to="/pages/product"
                  className="block hover:text-[#c4a484] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/about-us"
                  className="block hover:text-[#c4a484] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/news"
                  className="block hover:text-[#c4a484] transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tin tức
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block hover:text-[#c4a484] transition text-left w-full"
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