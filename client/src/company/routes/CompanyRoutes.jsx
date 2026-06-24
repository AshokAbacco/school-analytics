import { Routes, Route } from "react-router-dom";

import DashboardPage from "../dashboard/DashboardPage";
import UsersPage from "../users/UsersPage";
import PaymentsPage from "../payments/PaymentsPage";
import AccessControlPage from "../access-control/AccessControlPage";

import ProtectedRoute from "./ProtectedRoute";

const CompanyRoutes = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Universities */}
      <Route
        path="/universities"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      {/* Access Control */}
      <Route
        path="/access-control"
        element={
          <ProtectedRoute>
            <AccessControlPage />
          </ProtectedRoute>
        }
      />

      {/* Payments */}
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