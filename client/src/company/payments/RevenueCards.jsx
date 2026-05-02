const RevenueCards = ({ summary }) => {
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${summary?.totalRevenue || 0}`,
    },
    {
      title: "Monthly Revenue",
      value: `₹${summary?.monthlyRevenue || 0}`,
    },
    {
      title: "Success Payments",
      value: summary?.successfulPayments || 0,
    },
    {
      title: "Failed Payments",
      value: summary?.failedPayments || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
        >
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            {card.title}
          </p>

          <h2 className="text-3xl font-black text-[#1A1A1A] mt-4">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default RevenueCards;