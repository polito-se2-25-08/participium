import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Redirect() {
	const { user } = useAuth();

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Navigate to="/" replace />;
}
