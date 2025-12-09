import { MapContainer, TileLayer } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";

import { useState } from "react";

import "leaflet/dist/leaflet.css";
import MapClickHandler from "./MapClickHandler";
import SearchLocationInput from "./SearchLocationInput";
import TempMarker from "./TempMarker";
import type { MarkerI } from "../../interfaces/components/MarkerI";
import { ReportMarkers } from "./ReportMarkers";
import { MarkerInfo } from "./MarkerInfo";

const ZOOM = 13;
const TURIN_BOUNDS: LatLngBoundsExpression = [
	[44.96, 7.5],
	[45.18, 7.8],
];

interface ReportMapViewProps {
	className?: string;
	scrollWheelZoom?: boolean;
	isReport?: boolean;
	setAdress?: React.Dispatch<React.SetStateAction<string>>;
	setLocation?: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

export function MapWindow({
	className,
	scrollWheelZoom = true,
	isReport = false,
	setAdress,
	setLocation,
}: ReportMapViewProps) {
	const [tempMarker, setTempMarker] = useState<MarkerI | null>(null);
	const [markerList, setMarkerList] = useState<MarkerI[] | null>(null);

	return (
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
				Markers={markerList}
				setMarkers={setMarkerList}
				isDashboard={!isReport}
			/>
			<TempMarker tempMarker={tempMarker} setTempMarker={setTempMarker} />
			{!isReport && <MarkerInfo />}
		</MapContainer>
	);
}
