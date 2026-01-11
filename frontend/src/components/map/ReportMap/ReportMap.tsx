import { MapContainer, TileLayer } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";

import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import MapClickHandler from "./MapClickHandler";
import type { MarkerI } from "../../../interfaces/components/MarkerI";
import TempMarker from "../DashboardMap/TempMarker";
import MapCenterUpdater from "./MapCenterUpdater";

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
	initialLocation?: [number, number] | null;
	initialAddress?: string;
}

export function ReportMap({
	className,
	scrollWheelZoom = true,
	setAdress,
	setLocation,
	initialLocation,
	initialAddress,
}: ReportMapViewProps) {
	const [tempMarker, setTempMarker] = useState<MarkerI | null>(null);

	useEffect(() => {
		if (initialLocation && initialAddress) {
			const marker: MarkerI = {
				title: "Preloaded Location",
				timestamp: new Date().toISOString(),
				anonymity: true,
				category: "Category A",
				userId: "user123",
				status: "Pending approval",
				position: initialLocation,
				address: initialAddress,
			};
			setTempMarker(marker);
		}
	}, [initialLocation, initialAddress]);

	const mapCenter: [number, number] = tempMarker?.position || [45.0703, 7.6869];

	return (
		<MapContainer
			center={mapCenter}
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
			<MapCenterUpdater center={tempMarker?.position} />
			<TempMarker tempMarker={tempMarker} setTempMarker={setTempMarker} />
		</MapContainer>
	);
}
