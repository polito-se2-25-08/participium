import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "../providers/AuthContext";
import PageTitle from "../titles/PageTitle";
import DangerButton from "../buttons/variants/danger/DangerButton";
import OutlinePrimaryButton from "../buttons/variants/primary/OutlinePrimaryButton";

export function ProfilePage() {
	const user = useUser();
	const { logout } = useAuth();

	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div className="flex flex-col gap-4 border border-gray-600 p-4">
			<PageTitle>Your profile</PageTitle>
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
			<DangerButton onClick={handleLogout}>Logout</DangerButton>

			{user.role === "ADMIN" && (
				<OutlinePrimaryButton onClick={() => navigate("/setup")}>
					Setup and account
				</OutlinePrimaryButton>
			)}
		</div>
	);
}
