import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Layout } from "./Components/Layout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import ReportForm from "./Components/ReportForm";

export default function App() {
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route element={<ProtectedRoutes />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/report" element={<ReportForm />} />
						<Route path="/profile" element={<ProfilePage />} />
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	);
}
