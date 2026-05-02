const PaymentCharts = ({
  universityRevenue,
  packageAnalytics,
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* UNIVERSITY REVENUE */}
      <div className="bg-white rounded-[2rem] p-6 border border-gray-100">
        <h2 className="text-xl font-black mb-6">
          University Revenue
        </h2>

        <div className="space-y-4">
          {universityRevenue?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-2xl p-4"
            >
              <div>
                <p className="font-bold text-[#1A1A1A]">
                  {item.universityName}
                </p>

                <p className="text-sm text-gray-500">
                  {item.totalSchools} Schools
                </p>
              </div>

              <h3 className="text-xl font-black text-[#FF5722]">
                ₹{item.totalRevenue}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* PACKAGE ANALYTICS */}
      <div className="bg-white rounded-[2rem] p-6 border border-gray-100">
        <h2 className="text-xl font-black mb-6">
          Package Analytics
        </h2>

        <div className="space-y-4">
          {packageAnalytics?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-2xl p-4"
            >
              <div>
                <p className="font-bold text-[#1A1A1A]">
                  {item.planName}
                </p>

                <p className="text-sm text-gray-500">
                  {item.totalSubscriptions} Subscriptions
                </p>
              </div>

              <h3 className="text-xl font-black text-[#FF5722]">
                ₹{item.totalRevenue}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentCharts;