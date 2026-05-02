import { getPaymentsAnalytics } from "../services/payment.service.js";

export const getPaymentsDashboard = async (req, res) => {
  try {
    const data = await getPaymentsAnalytics();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Payment Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payment dashboard data",
    });
  }
};