import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "../../providers/AuthContext";
import DangerButton from "../../buttons/variants/danger/DangerButton";
import SubTitle from "../../titles/SubTitle";

export default function ExternalMaintainerProfilePage() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { user } = useUser();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<div className="flex flex-col rounded-xl shadow-xl border border-gray-600 p-8 gap-3">
			<SubTitle fontSize="text-[1.9rem]">{user.username}</SubTitle>
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
			<div className="flex flex-col gap-4">
				<div className="flex justify-end">
					<DangerButton onClick={handleLogout}>Logout</DangerButton>
				</div>
			</div>
		</div>
	);
}
