const API_URL = import.meta.env.VITE_API_URL;

// ✅ GET UNIVERSITY + SCHOOL DATA
export const fetchUniversityDashboard = async () => {
  const res = await fetch(`${API_URL}/api/universities/dashboard`);

  if (!res.ok) {
    throw new Error("Failed to fetch university data");
  }

  const data = await res.json();
  return data.data;
};