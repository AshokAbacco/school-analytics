// client\src\company\layout\Topbar.jsx
import { Bell, Search, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const Topbar = ({ onMenuClick, toggleCollapse, isCollapsed }) => {
  return (
    <div className="h-20 px-4 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button[cite: 18] */}
        <button onClick={onMenuClick} className="md:hidden p-2 bg-white/50 rounded-xl">
          <Menu size={20} className="text-[#1A1A1A]" />
        </button>

        {/* Desktop Collapse Toggle[cite: 18] */}
        <button 
          onClick={toggleCollapse} 
          className="hidden md:flex p-2 hover:bg-white/60 rounded-xl text-gray-400 hover:text-[#1A1A1A] transition-all"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>
      
      {/* Search Input[cite: 18] */}
      <div className="flex-1 max-w-md relative group hidden sm:block">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full bg-white/40 border border-transparent focus:bg-white focus:border-gray-200 py-2.5 pl-12 pr-4 rounded-2xl text-sm font-medium transition-all outline-none"
        />
      </div>

      {/* Notifications and Profile[cite: 18] */}
      <div className="flex items-center gap-2 md:gap-5 ml-auto">
        <button className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/40 hover:bg-white rounded-full transition-all text-gray-500">
          <Bell size={20} />
        </button>
        <img 
          src="https://ui-avatars.com/api/?name=Admin&background=fff&color=111&bold=true" 
          className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200"
          alt="User"
        />
      </div>
    </div>
  );
};

export default Topbar;