// client\src\company\layout\Sidebar.jsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, LogOut, Infinity, X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const menus = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Users", path: "/users", icon: Users },
    { name: "Payments", path: "/payments", icon: CreditCard },
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-[50] w-64 bg-[#DDE2E7] transform transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0 md:flex md:flex-col py-6
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      h-screen md:h-full
    `}>
      {/* Mobile Close Button */}
      <button onClick={onClose} className="md:hidden absolute top-6 right-6 text-gray-500">
        <X size={24} />
      </button>
      
      {/* Logo Section - Reduced padding */}
      <div className="px-6 py-4 mb-8 flex items-center gap-3">
        <div className="w-9 h-9 bg-[#FF5722] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
          <Infinity className="text-white" size={20} />
        </div>
        <h1 className="text-lg font-black tracking-tighter text-[#1A1A1A] uppercase italic">
          SCHOOL<span className="text-gray-400 not-italic">HUB</span>
        </h1>
      </div>

      {/* Navigation - More compact horizontal padding */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            onClick={() => onClose()} 
            className={({ isActive }) =>
              `group flex items-center gap-3 px-6 py-3.5 transition-all duration-300 ${
                isActive ? "text-[#1A1A1A] bg-white/20" : "text-gray-500 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <menu.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[13px] font-bold tracking-tight uppercase">{menu.name}</span>
                {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-[#FF5722]" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section - Streamlined for smaller width */}
      <div className="px-4 mt-auto">
        <div className="bg-white/40 backdrop-blur-md rounded-[1.5rem] p-4 border border-white/60 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-black text-[#1A1A1A]">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#1A1A1A] leading-none">Admin</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Super Admin</span>
            </div>
          </div>
          
        <button
          onClick={() => {
            localStorage.removeItem("token");   // remove auth
            window.location.href = "/login";    // redirect to login
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-[#1A1A1A] hover:bg-[#FF5722] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 group"
        >
          <LogOut size={14} />
          Sign Out
        </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;