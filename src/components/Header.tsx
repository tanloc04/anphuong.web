import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import SearchBox from './ui/SearchBox';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white/50 backdrop-blur-md shadow-sm z-50">
      {/* Logo */}
      <div className="text-2xl font-extrabold text-gray-900">An Phương</div>

      {/* Menu */}
      <nav>
        <ul className="flex space-x-8 ml-60">
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer transition">Sản phẩm</li>
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer transition">Dự án</li>
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer transition">Về chúng tôi</li>
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer transition">Tin tức</li>
          <li className="text-gray-600 hover:text-gray-900 cursor-pointer transition">Liên hệ</li>
        </ul>
      </nav>

      {/* Search + Cart */}
      <div className="flex items-center space-x-5">
        {/* Container for SearchBox with fixed width to prevent layout shift */}
        <div className="relative w-72 flex items-center">
          <div className="absolute right-0">
            <SearchBox />
          </div>
        </div>
        <FontAwesomeIcon
          icon={faUser}
          className="text-xl text-gray-800 cursor-pointer hover:text-black transition"
        />
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="text-xl text-gray-800 cursor-pointer hover:text-black transition"
        />
      </div>
    </header>
  );
};

export default Header;