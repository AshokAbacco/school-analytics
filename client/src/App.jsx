import { Routes, Route } from "react-router-dom";
import CompanyLayout from "./company/layout/CompanyLayout";
import LoginPage from "./company/auth/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected App */}
      <Route path="/*" element={<CompanyLayout />} />
    </Routes>
  );
}

export default App;