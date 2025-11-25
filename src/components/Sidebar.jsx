import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Users,
  Database,
  FileText,
  Settings,
  LogOut,
  MoreHorizontal,
  User,
  Bell,
  CreditCard,
} from "lucide-react";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navSections = [
    {
      title: "Home",
      links: [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { to: "/projects", label: "Projects", icon: <Folder size={16} /> },
        { to: "/team", label: "Team", icon: <Users size={16} /> },
      ],
    },
    {
      title: "Documents",
      links: [
        { to: "/Login", label: "Login", icon: <Database size={16} /> },
        { to: "/reports", label: "Reports", icon: <FileText size={16} /> },
        {
          to: "/word-assistant",
          label: "Word Assistant",
          icon: <FileText size={16} />,
        },
      ],
    },
  ];

  const bottomLinks = [
    { to: "/settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <div className="fixed">
      <aside className="w-60 h-screen bg-[#0f0f0f] text-white flex flex-col justify-between border-r border-white/10 relative">
        {/* Logo */}
        <div>
          <div className="p-3 text-lg font-semibold flex items-center gap-1.5 border-b border-white/10">
            Admin Dashboard
          </div>

          {/* Navigation */}
          <nav className="mt-3 px-2 space-y-5">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[11px] uppercase text-gray-400 font-semibold mb-1.5 px-2 tracking-wider">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-0.5">
                  {section.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-all duration-200 ${
                          isActive
                            ? "bg-orange-500/20 text-orange-400"
                            : "text-gray-300 hover:bg-orange-500/10 hover:text-orange-400"
                        }`
                      }
                    >
                      {link.icon}
                      <span className="font-medium">{link.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-2.5 space-y-1.5 relative">
          {bottomLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-gray-300 hover:bg-orange-500/10 hover:text-orange-400"
                }`
              }
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}

          {/* Profile Section with Dropdown */}
          <div
            className="flex items-center justify-between mt-3 bg-white/5 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40?img=68"
                alt="avatar"
                className="w-7 h-7 rounded-full border border-orange-500/40"
              />
              <div>
                <p className="text-[13px] font-semibold">codebygarv</p>
                <p className="text-[11px] text-gray-400">codebygarv@gmail.com</p>
              </div>
            </div>
            <MoreHorizontal size={18} />
          </div>

          {/* Dropdown Menu */}
          {openMenu && (
            <div
              ref={menuRef}
              className="absolute left-2 bottom-16 w-56 bg-[#181818] text-gray-200 rounded-xl shadow-lg border border-white/10 p-3 space-y-3 animate-fadeIn"
            >
              <div className="flex items-center gap-3 p-2 border-b border-white/10">
                <img
                  src="https://i.pravatar.cc/50?img=68"
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="text-[14px] font-semibold">codebygarv</h4>
                  <p className="text-[11px] text-gray-400">codebygarv@gmail.com</p>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1 text-[13px]">
                <button className="w-full flex items-center gap-2 px-2 py-2 text-gray-300 hover:bg-orange-500/10 hover:text-orange-400 rounded-md">
                  <User size={16} /> Account
                </button>
                <button className="w-full flex items-center gap-2 px-2 py-2 text-gray-300 hover:bg-orange-500/10 hover:text-orange-400 rounded-md">
                  <CreditCard size={16} /> Billing
                </button>
                <button className="w-full flex items-center gap-2 px-2 py-2 text-red-400 hover:bg-red-500/10 rounded-md">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
