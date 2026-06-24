// client/src/company/layout/Sidebar.jsx

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Infinity,
  ShieldBan,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, isCollapsed }) => {
  const menus = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Universities", path: "/universities", icon: Users },
{ name: "Access Control", path: "/access-control", icon: ShieldBan },
    { name: "Payments", path: "/payments", icon: CreditCard },
  ];

  return (
    <div
      style={{
        width: isCollapsed ? "96px" : "256px",
      }}
      className={`
        bg-[#DDE2E7]
        flex flex-col
        py-6
        transition-[width] duration-300 ease-in-out
        overflow-x-hidden overflow-y-auto

        fixed inset-y-0 left-0 z-50
        md:relative md:inset-auto md:left-auto

        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0

        flex-shrink-0
      `}
    >
      {/* Mobile Close */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-6 right-4 text-gray-500"
      >
        <X size={22} />
      </button>

      {/* Logo */}
      <div
        className={`mb-10 flex items-center px-4 ${
          isCollapsed ? "justify-center" : "gap-3"
        }`}
      >
        <div className="w-10 h-10 bg-[#FF5722] rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-orange-200">
          <Infinity className="text-white" size={20} />
        </div>

        <div
          className={`
            overflow-hidden transition-all duration-300
            ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
          `}
        >
          <h1 className="text-lg font-black tracking-tighter text-[#1A1A1A] uppercase italic whitespace-nowrap">
            SCHOOL
            <span className="text-gray-400 not-italic">HUB</span>
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            onClick={onClose}
            className={({ isActive }) =>
              `
                flex items-center rounded-2xl transition-all duration-200

                ${
                  isCollapsed
                    ? "justify-center px-3 py-4"
                    : "gap-3 px-4 py-3.5"
                }

                ${
                  isActive
                    ? "bg-white text-[#1A1A1A] shadow-sm"
                    : "text-gray-500 hover:bg-white/50 hover:text-[#1A1A1A]"
                }
              `
            }
          >
            {({ isActive }) => (
              <>
                <menu.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="flex-shrink-0"
                />

                <div
                  className={`
                    overflow-hidden transition-all duration-300
                    ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                  `}
                >
                  <span className="text-[13px] font-bold tracking-tight uppercase whitespace-nowrap">
                    {menu.name}
                  </span>
                </div>

                {!isCollapsed && isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-[#FF5722]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className="px-3 mt-auto pt-6">
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center font-black text-[#1A1A1A]">
              AD
            </div>
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-md border border-white/60 shadow-sm rounded-[1.8rem] p-4 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-black text-[#1A1A1A] text-sm shadow-sm">
                AD
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-black text-[#1A1A1A] leading-none">
                  Admin
                </span>

                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                  Super Admin
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-[#1A1A1A] hover:bg-[#FF5722] hover:text-white transition-all text-[11px] font-black uppercase tracking-widest border border-gray-100"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;