import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { Layout } from "./components/Layout";
import Dashboard from "./components/pages/Dashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";

import AccountSetupPage from "./components/pages/AccountSetupPage";
import { AssignRolesPage } from "./components/pages/AssignRolesPage";
import { AuthProvider } from "./components/providers/AuthContext";
import ReportFormPage from "./components/pages/ReportFormPage";

import "./App.css";
import Acl from "./components/providers/Acl";
import Redirect from "./components/providers/Redirect";

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

						<Route element={<Acl allowedRoles={["ADMIN"]} />}>
							<Route
								path="/setup"
								element={<AccountSetupPage />}
							/>
							<Route
								path="/assign-roles"
								element={<AssignRolesPage />}
							/>
						</Route>

						<Route element={<Acl allowedRoles={["CITIZEN"]} />}>
							<Route
								path="/report"
								element={<ReportFormPage />}
							/>
						</Route>

						<Route path="/profile" element={<ProfilePage />} />
						</Route>

						<Route path="*" element={<Redirect />} />
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}
