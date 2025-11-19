import { useAuth } from "./providers/AuthContext";

import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center text-gray-500">
				Loading...
			</div>
		);
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
