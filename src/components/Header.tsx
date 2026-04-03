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
import { useQuery } from "@tanstack/react-query";
import { cartApi } from "@/api/cartApi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();

  const displayUsername =
    user?.username || localStorage.getItem("username") || user?.email;
  const isLoggedIn = isAuthenticated || !!localStorage.getItem("token");

  const handleLogout = () => {
    logout();
  };

  const [localCartCount, setLocalCartCount] = useState(0);

  const { data: cartData } = useQuery({
    queryKey: ["cart-data"],
    queryFn: async () => {
      const res = await cartApi.getCart();
      return res.data?.data;
    },
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });

  const calculateLocalCart = () => {
    const localStr = localStorage.getItem("cart");
    if (localStr) {
      try {
        const parsed = JSON.parse(localStr);
        const total = parsed.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0,
        );
        setLocalCartCount(total);
      } catch (e) {
        setLocalCartCount(0);
      }
    } else {
      setLocalCartCount(0);
    }
  };

  useEffect(() => {
    calculateLocalCart();

    const handleLocalCartChange = () => calculateLocalCart();
    window.addEventListener("localCartUpdated", handleLocalCartChange);

    window.addEventListener("storage", handleLocalCartChange);

    return () => {
      window.removeEventListener("localCartUpdated", handleLocalCartChange);
      window.removeEventListener("storage", handleLocalCartChange);
    };
  }, []);

  const totalCartItems = isLoggedIn
    ? cartData?.totalItems ||
      cartData?.cartItems?.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0,
      ) ||
      0
    : localCartCount;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        <nav className="hidden md:flex flex-1 justify-center px-4 h-full">
          <ul className="flex items-center space-x-4 lg:space-x-8 font-montserrat-medium text-sm lg:text-base h-full">
            <li className="relative group h-full flex items-center">
              <div
                className="text-gray-600 hover:text-gray-900 transition whitespace-nowrap flex items-center gap-1 cursor-pointer h-full"
                onClick={() => navigate("/pages/product")}
              >
                Sản phẩm
                <i className="pi pi-angle-down text-[10px] mt-1 transition-transform duration-300 group-hover:rotate-180"></i>
              </div>

              <div className="absolute top-20 -left-8 w-[750px] bg-white/85 backdrop-blur-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-2xl border border-gray-200/50 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out z-50 overflow-hidden cursor-default">
                <div className="p-8 grid grid-cols-3 gap-8">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2 border-gray-200/60 uppercase tracking-wider text-sm">
                      Phòng Khách
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {/* ĐÃ SỬA URL THÀNH SỐ ID */}
                      <li>
                        <Link
                          to="/pages/product?category=1"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Sofa cao cấp
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pages/product?category=2"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Bàn trà / Bàn góc
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pages/product?category=3"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Kệ Tivi
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pages/product?category=12"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Tủ giày thông minh
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2 border-gray-200/60 uppercase tracking-wider text-sm">
                      Phòng Ngủ
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {/* ĐÃ SỬA URL THÀNH SỐ ID */}
                      <li>
                        <Link
                          to="/pages/product?category=4"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Giường ngủ
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pages/product?category=5"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Tủ quần áo
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pages/product?category=7"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Bàn trang điểm
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pages/product?category=8"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Tab đầu giường
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-gray-900 border-b pb-2 border-gray-200/60 uppercase tracking-wider text-sm">
                      Phòng Bếp
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {/* ĐÃ SỬA URL THÀNH SỐ ID */}
                      <li>
                        <Link
                          to="/pages/product?category=6"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Bàn ăn gia đình
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pages/product?category=9"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Ghế ăn
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pages/product?category=10"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Hệ tủ bếp
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/pages/product?category=11"
                          className="text-gray-600 hover:text-[#8B5E3C] hover:translate-x-1 transition-all inline-block text-sm font-medium"
                        >
                          Đảo bếp
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li className="h-full flex items-center">
              <Link
                to="/pages/about-us"
                className="text-gray-600 hover:text-gray-900 transition whitespace-nowrap h-full flex items-center"
              >
                Về chúng tôi
              </Link>
            </li>
            <li className="h-full flex items-center">
              <Link
                to="/pages/news"
                className="text-gray-600 hover:text-gray-900 transition whitespace-nowrap h-full flex items-center"
              >
                Tin tức
              </Link>
            </li>
            <li
              className="text-gray-600 hover:text-gray-900 transition cursor-pointer whitespace-nowrap h-full flex items-center"
              onClick={() => {
                document
                  .getElementById("footer")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="text-sm lg:text-base"
                  />
                </button>
              </div>
            ) : (
              <Link
                to="/account/login"
                className="flex flex-col items-center text-gray-600 hover:text-black transition"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-lg lg:text-xl cursor-pointer"
                />
                <span className="hidden lg:block text-xs mt-1 whitespace-nowrap"></span>
              </Link>
            )}
          </div>

          <Link to="/cart" className="relative group ml-2 mt-1">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-lg lg:text-2xl text-gray-600 group-hover:text-black transition"
            />
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-md animate-pop">
                {totalCartItems > 99 ? "99+" : totalCartItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-xl text-gray-800 ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
