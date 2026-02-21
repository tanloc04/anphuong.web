import { useNavigate, NavLink } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";
import { useDarkMode } from "@/hooks/useDarkMode";

const Sidebar = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const menuGroups = [
    {
      label: "TỔNG QUAN",
      items: [
        { label: "Dashboard", icon: "pi pi-home", to: "/admin" },
        { label: "Doanh thu", icon: "pi pi-chart-line", to: "/revenue" },
      ],
    },
    {
      label: "QUẢN LÝ",
      items: [
        { label: "Sản phẩm", icon: "pi pi-box", to: "/admin/products" },
        { label: "Đơn hàng", icon: "pi pi-shopping-cart", to: "/admin/orders" },
        { label: "Danh mục", icon: "pi pi-list", to: "/admin/categories" },
        { label: "Khách hàng", icon: "pi pi-users", to: "/admin/users" },
      ],
    },
    {
      label: "HỆ THỐNG",
      items: [{ label: "Cài đặt", icon: "pi pi-cog", to: "/admin/settings" }],
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
          AP Furniture
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {menuGroups.map((group, index) => (
          <div key={index} className="mb-6">
            <div className="px-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {group.label}
            </div>

            <ul className="list-none p-0 m-0 px-3">
              {group.items.map((item) => (
                <li key={item.to} className="mb-1">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `
                        flex items-center px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer p-ripple
                        ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                        }
                      `}
                  >
                    <i className={`${item.icon} mr-3 text-lg`}></i>
                    <span className="text-sm">{item.label}</span>
                    <Ripple />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 px-1">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Giao diện
          </span>
          <button
            onClick={toggleDarkMode}
            className={`
                relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none
                ${isDarkMode ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"} 
            `}
            title="Chuyển đổi giao diện"
          >
            <span
              className={`
                  absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out flex items-center justify-center
                  ${isDarkMode ? "translate-x-6" : "translate-x-0"}
              `}
            >
              <i
                className={`pi ${
                  isDarkMode ? "pi-sun" : "pi-moon"
                } text-[0.6rem] ${
                  isDarkMode ? "text-yellow-500" : "text-indigo-600"
                }`}
              ></i>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Avatar
            label="T"
            size="large"
            shape="circle"
            className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 font-bold"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
              Trang Quoc Bao
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Super Admin
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            title="Đăng xuất"
          >
            <i className="pi pi-sign-out"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
