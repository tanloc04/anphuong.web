import { useState } from "react";
import { NavLink } from "react-router-dom"; 
import { Menu, Home, Users, Box, Settings, LogOut, BarChart2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home,  to: "/admin" },
    { id: "users",     label: "Users",     icon: Users, to: "/admin/users" },
    { id: "products",  label: "Products",  icon: Box,   to: "/admin/products" }, // route này bạn có thể thêm sau
  ];

  const analyticsItems = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "reports",  label: "Reports",  icon: BarChart2 },
  ];

  return (
    <aside
      className={`flex flex-col h-screen bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 transition-all duration-200 shadow-sm
        ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-600 text-white">A</div>
          {!collapsed && (
            <div>
              <div className="text-sm font-semibold">AP Furniture Panel</div>
              <div className="text-xs text-zinc-500">Control center</div>
            </div>
          )}
        </div>

        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(v => !v)}
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search size={16} />
          </div>
          <input
            placeholder={collapsed ? "" : "Search..."}
            className={`w-full pl-10 pr-3 py-2 text-sm rounded-md border dark:bg-zinc-900 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-all ${collapsed ? "opacity-0 pointer-events-none" : ""}`}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-auto px-1 py-2">
        <ul className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full text-sm px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                      isActive ? "bg-violet-50 dark:bg-violet-900/30 font-medium" : ""
                    }`
                  }
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent">
                    <Icon size={18} />
                  </div>
                  {!collapsed && <span className="truncate cursor-pointer">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}

          <li>
            <div className="flex items-center justify-between px-3 mt-4 mb-1">
              {!collapsed && <div className="text-xs uppercase text-zinc-500">Analytics</div>}
              <button
                onClick={() => setShowAnalytics(v => !v)}
                className={`p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ${collapsed ? "hidden" : ""}`}
              >
                <Menu size={14} />
              </button>
            </div>

            <AnimatePresence>
              {showAnalytics && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 px-1"
                >
                  {analyticsItems.map(a => {
                    const Icon = a.icon;
                    return (
                      <li key={a.id}>
                        <button
                          className="flex items-center gap-3 w-full text-sm px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent">
                            <Icon size={14} />
                          </div>
                          {!collapsed && <span className="cursor-pointer">{a.label}</span>}
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {!collapsed && (
          <div className="mt-6 px-3">
            <div className="text-xs text-zinc-500 mb-2">Quick stats</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-800">
                <div className="text-xs text-zinc-500">Orders</div>
                <div className="text-lg font-semibold">1,234 (dummy)</div>
              </div>

              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-800">
                <div className="text-xs text-zinc-500">Revenue</div>
                <div className="text-lg font-semibold">$12,3k (dummy)</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="px-3 py-3 border-t dark:bg-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">T</div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-medium">Trang Quoc Bao</div>
              <div className="text-xs fext-zinc-500">Super Admin</div>
            </div>
          )}

          {!collapsed && (
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Settings">
                <Settings size={16} />
              </button>
              <button className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
// Lưu ý: Bạn cần cài đặt lucide-react và framer-motion
// npm install lucide-react framer-motion
// Hoặc
// yarn add lucide-react framer-motion