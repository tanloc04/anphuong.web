import { useState } from "react";
import { Menu, Home, Users, Box, Settings, LogOut, BarChart2, Search, ChevronLeft, ChevronRight, icons } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [showAnalytics, setShowAnalytics] = useState(true);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home
    },

    {
      id: "users",
      label: "Users",
      icon: Users
    },

    {
      id: "products",
      label: "Products",
      icon: Box
    }
  ];

  const analyticsItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart2
    },

    {
      id: "reports",
      label: "Reports",
      icon: BarChart2
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
              <div className="text-sm font-semibold">Admin Panel</div>
              <div className="text-xs text-zinc-500">Control center</div>
            </div>
          )}
        </div>

        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((v) => !v)}
          className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search size={16}/>
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
                      <Icon size={18} />                   
                    </div>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            );
          })} 
        </ul>
      </nav>

    </aside>
  )
}

export default Sidebar
