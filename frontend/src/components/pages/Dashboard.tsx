import { useNavigate } from "react-router-dom";

import PageTitle from "../titles/PageTitle";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import { MapWindow } from "../map/MapWindow";
import ContentContainer from "../containers/ContentContainer";
import { useUser } from "../providers/AuthContext";
export default function Dashboard() {
	const navigate = useNavigate();

	const user = useUser();

	return (
		<ContentContainer
			width="xl:w-5/6 sm:w-1/2 "
			gap="xl:gap-2 gap-4"
			padding="p-5"
		>
			<PageTitle>Participium</PageTitle>

			<p className="opacity-50 text-center">
				Citizen Participation in Urban Environment Management
			</p>

			<MapWindow
				className="min-h-[640px] w-full"
				scrollWheelZoom={false}
			/>

			{user.role === "CITIZEN" && (
				<PrimaryButton onClick={() => navigate("/report")}>
					Submit a report
				</PrimaryButton>
			)}
		</ContentContainer>
	);
}
