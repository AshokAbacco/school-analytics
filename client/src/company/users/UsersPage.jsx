// client\src\company\users\UsersPage.jsx
import { useState } from "react";
import SchoolDetailsCard from "./SchoolDetailsCard";
import { useDashboard } from "../hooks/useDashboard";
import { University, ArrowLeft, ChevronRight } from "lucide-react";

const UsersPage = () => {
  const { universities, loading, error } = useDashboard();
  // We only need to track the selected University now
  const [selectedUni, setSelectedUni] = useState(null);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5722]"></div>
    </div>
  );
  
  if (error) return <div className="p-8 text-red-500 font-bold bg-red-50 rounded-2xl">Error: {error}</div>;

  // STEP 2: Display Schools/Colleges for the selected University
  if (selectedUni) {
    return (
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
        <button 
          onClick={() => setSelectedUni(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-[#1A1A1A] font-bold mb-8 transition-all group px-3 py-2 rounded-xl border border-gray-200 w-fit bg-white/50 shadow-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to All Universities
        </button>

        <div className="mb-12 px-2">
          <h2 className="text-5xl font-black tracking-tighter text-[#1A1A1A] uppercase italic leading-none">
            {selectedUni.name}
          </h2>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-pulse" />
            <p className="text-[#FF5722] font-black text-xs uppercase tracking-[0.2em]">
              {selectedUni.totalSchools} Institutions Registered
            </p>
          </div>
        </div>

        {/* Responsive Grid displaying school stats[cite: 6] */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {selectedUni.schools.map((school) => (
            <SchoolDetailsCard key={school.id} school={school} />
          ))}
        </div>
      </div>
    );
  }

  // STEP 1: Display all Universities[cite: 6]
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter text-[#1A1A1A] uppercase italic leading-none">
          University <span className="text-gray-300 not-italic">Network</span>
        </h1>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-3">Select an institution to view school demographics</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {universities.map((uni) => (
          <div 
            key={uni.id}
            onClick={() => setSelectedUni(uni)}
            className="group bg-white p-8 rounded-[2.5rem] border border-white hover:border-gray-200 hover:shadow-2xl hover:shadow-black/5 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-[2rem] bg-[#F3F5F7] flex items-center justify-center text-gray-400 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-300 shadow-inner">
                <University size={36} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#1A1A1A] group-hover:text-[#FF5722] transition-colors leading-tight">
                  {uni.name}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[11px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-500 uppercase tracking-tighter">
                    {uni.totalSchools} Colleges / Schools
                  </span>
                </div>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-[#FF5722] group-hover:text-[#FF5722] group-hover:translate-x-2 transition-all shadow-sm">
              <ChevronRight size={24} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;