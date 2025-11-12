import { MapContainer, TileLayer } from "react-leaflet";
import SearchLocationInput from "./Map/SearchLocationInput";
import TempMarker from "./Map/TempMarker";
import type { MarkerI } from "../interface/Marker";
import { useState } from "react";
import MapClickHandler from "./Map/MapClickHandler";
import "leaflet/dist/leaflet.css";

const ZOOM = Number(import.meta.env.VITE_MAP_ZOOM)
	? Number(import.meta.env.VITE_MAP_ZOOM)
	: 13;

export function MapWindow() {
	const [tempMarker, setTempMarker] = useState<MarkerI | null>(null);

	return (
		<MapContainer
			center={[45.0703, 7.6869]}
			zoom={13}
			style={{ height: "100vh", width: "100%" }}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<MapClickHandler
				tempMarker={tempMarker}
				setTempMarker={setTempMarker}
			/>
			<SearchLocationInput setMarker={setTempMarker} />
			<TempMarker tempMarker={tempMarker} setTempMarker={setTempMarker} />
		</MapContainer>
	);
}
