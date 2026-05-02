// client\src\company\dashboard\components\StatsCards.jsx
import { IndianRupee, Building2, GraduationCap, CreditCard } from "lucide-react";

const StatsCards = ({ summary }) => {
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${summary?.totalRevenue?.toLocaleString() || 0}`,
      icon: IndianRupee,
      color: "text-[#FF5722]",
      bg: "bg-orange-50",
    },
    {
      title: "Monthly Revenue",
      value: `₹${summary?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: CreditCard,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Total Schools",
      value: summary?.totalSchools || 0,
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Universities",
      value: summary?.totalUniversities || 0,
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-[2.5rem] p-8 border border-white shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-8">
            <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} transition-transform group-hover:scale-110`}>
              <card.icon size={28} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {card.title}
              </p>
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-[#1A1A1A]">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;