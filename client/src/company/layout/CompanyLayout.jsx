// client/src/company/layout/CompanyLayout.jsx

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CompanyRoutes from "../routes/CompanyRoutes";

const CompanyLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#DDE2E7] md:p-3 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isCollapsed={isCollapsed}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        <div className="bg-[#F3F5F7] md:rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden border border-white/50 flex flex-col h-full">
          <Topbar
            onMenuClick={() => setIsMobileMenuOpen(true)}
            toggleCollapse={() => setIsCollapsed((prev) => !prev)}
            isCollapsed={isCollapsed}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <CompanyRoutes />
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default CompanyLayout;