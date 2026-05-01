// client\src\company\layout\CompanyLayout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CompanyRoutes from "../routes/CompanyRoutes";

const CompanyLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // Reduced gap-5 to gap-2 and p-5 to p-3 for a tighter look on desktop
    <div className="flex h-screen bg-[#DDE2E7] p-0 md:p-3 gap-0 md:gap-3 overflow-hidden">
      
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col bg-[#F3F5F7] md:rounded-[2rem] shadow-2xl shadow-black/5 overflow-hidden relative border-t md:border border-white/50">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <CompanyRoutes />
        </main>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[40] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default CompanyLayout;