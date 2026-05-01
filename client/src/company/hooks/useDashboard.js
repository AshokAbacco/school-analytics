import { useEffect, useState } from "react";
import { fetchUniversityDashboard } from "../services/userService";

export const useDashboard = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUniversityDashboard();
        setUniversities(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { universities, loading, error };
};