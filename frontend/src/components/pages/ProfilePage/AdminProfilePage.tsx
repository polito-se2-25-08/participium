import { useNavigate } from "react-router-dom";
import OutlinePrimaryButton from "../../buttons/variants/primary/OutlinePrimaryButton";
import { useAuth, useUser } from "../../providers/AuthContext";
import DangerButton from "../../buttons/variants/danger/DangerButton";

export default function AdminProfilePage() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { user } = useUser();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};
	return (
		<>
			<div className="flex flex-col gap-2">
				<div className="flex">
					<span className="font-semibold w-32">Name:</span>
					<span className="flex-1">{user.name}</span>
				</div>

				<div className="flex">
					<span className="font-semibold w-32">Surname:</span>
					<span className="flex-1">{user.surname}</span>
				</div>

				<div className="flex">
					<span className="font-semibold w-32">Username:</span>
					<span className="flex-1">{user.username}</span>
				</div>

				<div className="flex">
					<span className="font-semibold w-32">Email:</span>
					<span className="flex-1">{user.email}</span>
				</div>

				<div className="flex">
					<span className="font-semibold w-32">Role:</span>
					<span className="flex-1">{user.role}</span>
				</div>
			</div>

			<OutlinePrimaryButton onClick={() => navigate("/setup")}>
				Setup an account
			</OutlinePrimaryButton>
			<OutlinePrimaryButton onClick={() => navigate("/assign-roles")}>
				Manage users
			</OutlinePrimaryButton>
			<DangerButton onClick={handleLogout}>Logout</DangerButton>
		</>
	);
}
