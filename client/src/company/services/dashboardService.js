const API_URL = import.meta.env.VITE_API_URL;

// ✅ FETCH DASHBOARD ANALYTICS
export const fetchDashboardAnalytics = async () => {
  const res = await fetch(
    `${API_URL}/api/dashboard/analytics`
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch dashboard analytics"
    );
  }

  const data = await res.json();

  return data.data;
};