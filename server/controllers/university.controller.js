//server\controllers\university.controller.js
import { getDashboardData } from "../services/university.service.js";

export const getUniversityDashboard = async (req, res) => {
  try {
    const data = await getDashboardData();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data"
    });
  }
};