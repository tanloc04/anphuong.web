import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion, AnimatePresence } from "framer-motion"
import { faBarChart, faBars, faBox, faChevronLeft, faChevronRight, faGear, faHome, faRightFromBracket, faSearch, faUser, faUsers } from "@fortawesome/free-solid-svg-icons"

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [showAnalytics, setShowAnalytics] = useState(true);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FontAwesomeIcon icon={faHome} />
    },

    {
      id: "users",
      label: "Users",
      icon: <FontAwesomeIcon icon={faUsers} />
    },

    {
      id: "products",
      label: "Products",
      icon: <FontAwesomeIcon icon={faBox} />
    }
  ];

  const analyticsItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <FontAwesomeIcon icon={faBarChart} />
    },

    {
      id: "reports",
      label: "Reports",
      icon: <FontAwesomeIcon icon={faBarChart} />
    }
  ];

  return (
    <aside 
      className={`flex flex-col h-screen bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 transition-all duration-200 shadow-sm
        ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-600 text-white">
            A
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-semibold">AP Furniture Panel</div>
              <div className="text-xs text-zinc-500">Control center</div>
            </div>
          )}
        </div>

        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((v) => !v)}
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {collapsed ? <FontAwesomeIcon icon={faChevronRight} /> : <FontAwesomeIcon icon={faChevronLeft} />}
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <FontAwesomeIcon icon={faSearch} />
          </div>

          <input 
            placeholder={collapsed ? "" : "Search..."}
            className={`w-full pl-10 pr-3 py-2 text-sm rounded-md border dark:bg-zinc-900 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-violet-400 transition-all ${collapsed ? "opacity-0 pointer-events-none" : ""}`}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-auto px-1 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button onClick={() => setActive(item.id)}
                  className={`flex items-center gap-3 w-full text-sm px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${isActive ? "bg-violet-50 dark:bg-violet-900/30 font-medium" : ""}`}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent">
                      {Icon}               
                    </div>
                    {!collapsed && <span className="truncate cursor-pointer">{item.label}</span>}
                </button>
              </li>
            );
          })}

          <li>
            <div className="flex items-center justify-between px-3 mt-4 mb-1">
              {!collapsed && <div className="text-xs uppercase text-zinc-500">Analytics</div>}
              <button 
                onClick={() => setShowAnalytics((v) => !v)}
                className={`p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ${collapsed ? "hidden" : ""}`}
                >
                  <FontAwesomeIcon icon={faBars} />
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
                    {analyticsItems.map((a) => {
                      const Icon = a.icon;
                      return (
                        <li key={a.id}>
                          <button
                            onClick={() => setActive(a.id)}
                            className={`flex items-center gap-3 w-full text-sm px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${active === a.id ? "bg-violet-50 dark:bg-violet-900/30 font-medium" : ""}`}
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent">
                              {Icon}
                            </div>
                            {!collapsed && <span className="cursor-pointer">{a.label}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )
              }
            </AnimatePresence>
          </li> 
        </ul>

        {!collapsed && 
          (
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
          )
        }
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
                <FontAwesomeIcon icon={faGear} />
              </button>
              <button className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800" title="Logout">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar;
