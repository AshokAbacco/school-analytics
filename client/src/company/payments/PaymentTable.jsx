const PaymentTable = ({ payments }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-black text-[#1A1A1A]">
          Payment History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-xs uppercase text-gray-500">
                University
              </th>

              <th className="text-left p-4 text-xs uppercase text-gray-500">
                School
              </th>

              <th className="text-left p-4 text-xs uppercase text-gray-500">
                Package
              </th>

              <th className="text-left p-4 text-xs uppercase text-gray-500">
                Amount
              </th>

              <th className="text-left p-4 text-xs uppercase text-gray-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {payments?.map((payment) => (
              <tr
                key={payment.id}
                className="border-t border-gray-100"
              >
                <td className="p-4 font-semibold">
                  {payment.universityName}
                </td>

                <td className="p-4">
                  {payment.schoolName}
                </td>

                <td className="p-4">
                  {payment.packages?.join(", ") || "N/A"}
                </td>

                <td className="p-4 font-black text-[#FF5722]">
                  ₹{payment.amount}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      payment.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;