import {
  getDashboardAnalytics,
} from "../services/dashboard.service.js";

export const dashboardAnalytics =
  async (req, res) => {
    try {
      const data =
        await getDashboardAnalytics();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch dashboard analytics",
      });
    }
  };