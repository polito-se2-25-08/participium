import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { Layout } from "./components/Layout";
import Dashboard from "./components/pages/Dashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";

import AccountSetupPage from "./components/pages/AccountSetupPage";
import { AuthProvider } from "./components/providers/AuthContext";
import ReportFormPage from "./components/pages/ReportFormPage";
import PendingReportsPage from "./components/pages/PendingReportsPage";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/report" element={<ReportFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/setUp" element={<AccountSetupPage />} />
              <Route path="/pending-reports" element={<PendingReportsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
