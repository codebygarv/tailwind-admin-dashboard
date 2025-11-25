import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, Search, User, LogOut, Moon, Sun } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    return path
      .split("/")
      .filter(Boolean)
      .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
      .join(" / ");
  };

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setOpenNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setOpenProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0f0f0f] border-b border-white/10 sticky top-0 z-30">
      {/* Sidebar Toggle Button */}
      <button
        className="text-gray-300 hover:text-orange-400 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={22} />
      </button>

      {/* Page Title */}
      <h1 className="text-lg font-semibold text-white tracking-wide">
        {getPageTitle() || "Dashboard"}
      </h1>

      {/* Right-Side Actions */}
      <div className="flex items-center gap-4 relative my-auto">
        {/* Notification Icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="relative text-gray-300 hover:text-orange-400 transition"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center bg-red-500 text-white rounded-full">
              3
            </span>
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-3 w-64 bg-[#181818] border border-white/10 rounded-xl shadow-lg p-3">
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                Notifications
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="p-2 hover:bg-white/5 rounded-md">
                  🔔 New user registered
                </li>
                <li className="p-2 hover:bg-white/5 rounded-md">
                  📁 Project report uploaded
                </li>
                <li className="p-2 hover:bg-white/5 rounded-md">
                  ⚠ Server reboot scheduled
                </li>
              </ul>
              <button className="mt-2 w-full text-center py-1.5 bg-orange-500/20 text-orange-400 rounded-md hover:bg-orange-500/30 transition text-xs">
                View All
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
