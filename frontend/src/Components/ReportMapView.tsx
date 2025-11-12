import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapClickHandler from "./Map/MapClickHandler";
import TempMarker from "./Map/TempMarker";
import type { MarkerI } from "../interface/Marker";
import "leaflet/dist/leaflet.css";
import type { Location } from "../types";

const ZOOM = Number(import.meta.env.VITE_MAP_ZOOM) || 13;
const TURIN_CENTER: [number, number] = [45.0703, 7.6869];

interface ReportMapViewProps {
	onLocationSelect?: (location: Location, address: string) => void;
	height?: string;
}

export default function ReportMapView({
	onLocationSelect,
	height = "350px",
}: ReportMapViewProps) {
	const [tempMarker, setTempMarker] = useState<MarkerI | null>(null);
	const prevMarkerRef = useRef<MarkerI | null>(null);

	// Watch for marker changes and notify parent
	useEffect(() => {
		if (tempMarker && tempMarker.adress) {
			// Check if the address has changed
			if (
				!prevMarkerRef.current ||
				prevMarkerRef.current.adress !== tempMarker.adress ||
				prevMarkerRef.current.position[0] !== tempMarker.position[0] ||
				prevMarkerRef.current.position[1] !== tempMarker.position[1]
			) {
				prevMarkerRef.current = tempMarker;

				if (onLocationSelect) {
					const location: Location = {
						latitude: tempMarker.position[0],
						longitude: tempMarker.position[1],
					};
					onLocationSelect(location, tempMarker.adress);
				}
			}
		}
	}, [tempMarker, onLocationSelect]);

	return (
		<div
			style={{
				height,
				width: "100%",
				borderRadius: "8px",
				overflow: "hidden",
			}}
		>
			<MapContainer
				center={TURIN_CENTER}
				zoom={ZOOM}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<MapClickHandler
					tempMarker={tempMarker}
					setTempMarker={setTempMarker}
				/>
				<TempMarker
					tempMarker={tempMarker}
					setTempMarker={setTempMarker}
				/>
			</MapContainer>
		</div>
	);
}
