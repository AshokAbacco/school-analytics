import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = [
  "#FF5722",
  "#3B82F6",
  "#10B981",
  "#A855F7",
  "#F59E0B",
];

const SchoolOverview = ({
  summary,
  plans,
}) => {
  const chartData =
    plans?.map((plan) => ({
      name: plan.planName,
      value: plan.subscriptions,
    })) || [];

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#1A1A1A]">
          Subscription Overview
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Package subscription analytics
        </p>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              innerRadius={70}
              paddingAngle={4}
            >
              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-[#F8F9FB] rounded-2xl p-4">
          <p className="text-xs uppercase font-bold text-gray-400 tracking-widest">
            Schools
          </p>

          <h3 className="text-3xl font-black mt-2">
            {summary?.totalSchools || 0}
          </h3>
        </div>

        <div className="bg-[#F8F9FB] rounded-2xl p-4">
          <p className="text-xs uppercase font-bold text-gray-400 tracking-widest">
            Subscriptions
          </p>

          <h3 className="text-3xl font-black mt-2">
            {summary?.totalSubscriptions ||
              0}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SchoolOverview;