// client\src\company\dashboard\components\RecentPayments.jsx
const RecentPayments = ({ payments }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-white overflow-hidden shadow-xl shadow-black/5">
      <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1A1A1A] uppercase italic">
            Recent <span className="text-gray-300 not-italic">Transactions</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time payment monitoring</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F9FB]">
              {["School", "University", "Plan", "Amount", "Status", "Date"].map((head) => (
                <th key={head} className="text-left px-8 py-5 text-[10px] uppercase font-black tracking-widest text-gray-400">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments?.map((payment) => (
              <tr key={payment.id} className="hover:bg-[#F8F9FB] transition-colors group">
                <td className="px-8 py-5 font-black text-[#1A1A1A] text-sm uppercase italic">{payment.school}</td>
                <td className="px-8 py-5 text-gray-500 font-bold text-xs uppercase tracking-tighter">{payment.university}</td>
                <td className="px-8 py-5">
                  <span className="bg-[#1A1A1A] text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {payment.plan}
                  </span>
                </td>
                <td className="px-8 py-5 font-black text-[#FF5722] text-sm italic">₹{payment.amount.toLocaleString()}</td>
                <td className="px-8 py-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    payment.status === "SUCCESS" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${payment.status === "SUCCESS" ? "bg-emerald-600" : "bg-rose-600"} animate-pulse`} />
                    {payment.status}
                  </div>
                </td>
                <td className="px-8 py-5 text-gray-400 font-bold text-xs uppercase">{new Date(payment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPayments;