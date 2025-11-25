import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthContext";
import DangerButton from "../../buttons/variants/danger/DangerButton";

export default function TechnitianProfilePage() {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate("/");
	};
	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-end">
				<DangerButton onClick={handleLogout}>Logout</DangerButton>
			</div>
		</div>
	);
}
