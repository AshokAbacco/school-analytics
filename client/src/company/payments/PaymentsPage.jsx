// client/src/company/payments/PaymentsPage.jsx

import { useEffect, useState } from "react";
import RevenueCards from "./RevenueCards";
import PaymentCharts from "./PaymentCharts";
import PaymentTable from "./PaymentTable";
import { fetchPaymentsDashboard } from "../services/paymentService";

const PaymentsPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await fetchPaymentsDashboard();

      setDashboardData(data);
    } catch (error) {
      console.error("Payments Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-10 h-10 border-4 border-[#FF5722] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-black tracking-tighter text-[#1A1A1A] uppercase italic leading-none">
          Payment <span className="text-gray-300 not-italic">Analytics</span>
        </h1>

        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-3">
          Monitor revenue, subscriptions and university payments
        </p>
      </div>

      {/* REVENUE CARDS */}
      <RevenueCards summary={dashboardData?.summary} />

      {/* CHARTS */}
      <PaymentCharts
        universityRevenue={dashboardData?.universityRevenue}
        packageAnalytics={dashboardData?.packageAnalytics}
      />

      {/* PAYMENT TABLE */}
      <PaymentTable payments={dashboardData?.paymentHistory} />
    </div>
  );
};

export default PaymentsPage;