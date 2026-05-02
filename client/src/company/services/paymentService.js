// client/src/company/services/paymentService.js

const API_URL = import.meta.env.VITE_API_URL;

// ✅ GET PAYMENTS DASHBOARD
export const fetchPaymentsDashboard = async () => {
  const res = await fetch(`${API_URL}/api/payments/dashboard`);

  if (!res.ok) {
    throw new Error("Failed to fetch payments dashboard");
  }

  const data = await res.json();

  return data.data;
};