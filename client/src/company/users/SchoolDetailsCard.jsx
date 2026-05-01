// client\src\company\users\SchoolDetailsCard.jsx
import { Users, GraduationCap, Heart, Briefcase } from "lucide-react";

const SchoolDetailsCard = ({ school }) => {
  const stats = [
    { label: "Students", value: school.studentCount || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Teachers", value: school.teacherCount || 0, icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Parents", value: school.parentCount || 0, icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Staff", value: school.staffCount || 0, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-black tracking-tight text-[#1A1A1A]">
            {school.name}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Institutional Profile</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FF5722] flex items-center justify-center text-white shadow-lg shadow-orange-100">
          <GraduationCap size={24} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} p-5 rounded-[1.8rem] border border-transparent transition-all`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 opacity-70">
                {stat.label}
              </span>
            </div>
            <p className={`text-2xl font-black ${stat.color}`}>
              {stat.value >= 10000000 
                ? `${(stat.value / 10000000).toFixed(2)} Cr` 
                : stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchoolDetailsCard;