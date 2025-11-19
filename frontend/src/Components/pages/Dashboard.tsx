import { useNavigate } from "react-router-dom";

import PageTitle from "../titles/PageTitle";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import { MapWindow } from "../map/MapWindow";

export default function Dashboard() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col w-5/6 p-4 gap-3">
			<PageTitle>Participium</PageTitle>
			<p className="opacity-50 text-center">
				Citizen Participation in Urban Environment Management
			</p>

			<MapWindow
				className="min-h-[640px] w-full"
				scrollWheelZoom={false}
			/>

			<PrimaryButton onClick={() => navigate("/report")}>
				Submit a report
			</PrimaryButton>
		</div>
	);
}
