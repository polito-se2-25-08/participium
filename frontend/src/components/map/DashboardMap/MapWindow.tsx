import { MapContainer, TileLayer } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";

import { useState } from "react";

import "leaflet/dist/leaflet.css";
import MapClickHandler from "./MapClickHandler";

import { ReportMarkers } from "./ReportMarkers";
import TempMarker from "./TempMarker";
import SearchLocationInput from "./SearchLocationInput";
import type { ClientReportMapI } from "../../../interfaces/dto/report/NewReportResponse";
import type { MarkerI } from "../../../interfaces/components/MarkerI";
import { MarkerInfo } from "./MarkerInfo";
import UserReports from "../../pages/componets/UserReports";

const ZOOM = 13;
const TURIN_BOUNDS: LatLngBoundsExpression = [
	[44.96, 7.5],
	[45.18, 7.8],
];

interface ReportMapViewProps {
	className?: string;
	scrollWheelZoom?: boolean;
	isReport?: boolean;
	reports: ClientReportMapI[];
	setAdress?: React.Dispatch<React.SetStateAction<string>>;
	setLocation?: React.Dispatch<React.SetStateAction<[number, number] | null>>;
	setClickedReportId: React.Dispatch<React.SetStateAction<number>>;
	showRightPanel?: boolean;
	isCitizen?: boolean;
}

export function MapWindow({
	className,
	scrollWheelZoom = true,
	isReport = false,
	reports,
	setAdress,
	setLocation,
	showRightPanel,
	isCitizen,

	setClickedReportId,
}: ReportMapViewProps) {
	const [tempMarker, setTempMarker] = useState<MarkerI | null>(null);

	return (
		<div className="relative w-full h-full">
			<MapContainer
				center={[45.0703, 7.6869]}
				zoom={ZOOM}
				minZoom={12}
				className={className}
				scrollWheelZoom={scrollWheelZoom}
				maxBounds={TURIN_BOUNDS}
				maxBoundsViscosity={1.0}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<MapClickHandler
					tempMarker={tempMarker}
					setTempMarker={setTempMarker}
					setAdress={setAdress}
					setLocation={setLocation}
				/>
				{!isReport && <SearchLocationInput setMarker={setTempMarker} />}
				<ReportMarkers
					reports={reports}
					isDashboard={!isReport}
					setClickedReportId={setClickedReportId}
				/>
				<TempMarker tempMarker={tempMarker} setTempMarker={setTempMarker} />
				<MarkerInfo />
			</MapContainer>
			{showRightPanel && isCitizen && (
			<div className="absolute top-0 right-0 w-full sm:w-[28rem] md:w-[32rem] lg:w-[36rem] h-full shadow-lg z-[1000] overflow-hidden">
				<UserReports />
			</div>
			)}
		</div>
	);
}
