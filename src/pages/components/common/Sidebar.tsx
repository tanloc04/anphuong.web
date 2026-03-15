import { useNavigate, NavLink } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";

type MenuItem = {
  label: string;
  icon: string;
  to: string;
  disabled?: boolean;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const Sidebar = () => {
  const navigate = useNavigate();

  const menuGroups: MenuGroup[] = [
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
      items: [
        {
          label: "Cài đặt",
          icon: "pi pi-cog",
          to: "/admin/settings",
          disabled: true,
        },
      ],
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          AP Furniture
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {menuGroups.map((group, index) => (
          <div key={index} className="mb-6">
            <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {group.label}
            </div>

            <ul className="list-none p-0 m-0 px-3">
              {group.items.map((item) => (
                <li key={item.to} className="mb-1">
                  <NavLink
                    to={item.to}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                      }
                    }}
                    end
                    className={({ isActive }) => `
                        flex items-center px-3 py-3 rounded-lg transition-all duration-200
                        ${
                          item.disabled
                            ? "opacity-50 cursor-not-allowed text-gray-400" // Form mờ đi, chuột cấm
                            : isActive
                              ? "bg-indigo-50 text-indigo-600 font-medium p-ripple"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer p-ripple"
                        }
                      `}
                  >
                    <i className={`${item.icon} mr-3 text-lg`}></i>
                    <span className="text-sm">{item.label}</span>
                    {item.disabled && (
                      <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">
                        Sắp ra mắt
                      </span>
                    )}

                    {!item.disabled && <Ripple />}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <Avatar
            label="T"
            size="large"
            shape="circle"
            className="bg-indigo-100 text-indigo-600 font-bold"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              Trang Quoc Bao
            </p>
            <p className="text-xs text-gray-500 truncate">Super Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
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
