import { Routes, Route } from "react-router-dom";
import DashboardPage from "../dashboard/DashboardPage";
import UsersPage from "../users/UsersPage";
import PaymentsPage from "../payments/PaymentsPage";
import ProtectedRoute from "./ProtectedRoute";

const CompanyRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <PaymentsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default CompanyRoutes;