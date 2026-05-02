// client\src\company\dashboard\DashboardPage.jsx
import { useEffect, useState } from "react";
import StatsCards from "./components/StatsCards";
import UniversityChart from "./components/UniversityChart";
import SchoolOverview from "./components/SchoolOverview";
import RecentPayments from "./components/RecentPayments";
import { fetchDashboardAnalytics } from "../services/dashboardService";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchDashboardAnalytics();
        setDashboardData(data);
      } catch (error) {
        console.log("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#FF5722] border-t-transparent rounded-full animate-spin shadow-lg shadow-orange-100" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-black tracking-tighter text-[#1A1A1A] uppercase italic leading-none">
          Network <span className="text-gray-300 not-italic">Intelligence</span>
        </h1>
        <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.25em] mt-3 ml-1">
          Monitor revenue, school growth, and payment velocity
        </p>
      </div>

      {/* STATS SECTION */}
      <StatsCards summary={dashboardData?.summary} />

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <UniversityChart data={dashboardData?.universityAnalytics} />
        <SchoolOverview summary={dashboardData?.summary} plans={dashboardData?.planAnalytics} />
      </div>

      {/* PAYMENTS SECTION */}
      <RecentPayments payments={dashboardData?.recentPayments} />
    </div>
  );
};

export default DashboardPage;