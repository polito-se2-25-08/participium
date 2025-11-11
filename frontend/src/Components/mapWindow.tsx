import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import SearchLocationInput from "./Map/SearchLocationInput";
import TempMarker from "./Map/TempMarker";

const ZOOM = import.meta.env.VITE_MAP_ZOOM;

export function MapWindow() {
	return (
		<MapContainer
			center={[45.0703, 7.6869]}
			zoom={ZOOM}
			style={{ height: "100vh", width: "100%" }}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<SearchLocationInput />
			<TempMarker />
		</MapContainer>
	);
}
