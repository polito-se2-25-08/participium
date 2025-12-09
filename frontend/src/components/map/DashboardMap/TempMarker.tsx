import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { Icon, type LeafletMouseEvent } from "leaflet";

import temporaryMarker from "../../../assets/markers/temp_marker.svg";
import { fetchAddressByCoordinates } from "../../../action/mapAction";
import type { MarkerI } from "../../../interfaces/components/MarkerI";

interface TempMarkerProps {
	tempMarker: MarkerI | null;
	setTempMarker: React.Dispatch<React.SetStateAction<MarkerI | null>>;
}
export default function TempMarker({
	tempMarker,
	setTempMarker,
}: TempMarkerProps) {
	const [isLoading, setIsLoading] = useState(false);

	const getAddress = async (e: LeafletMouseEvent) => {
		setIsLoading(true);
		const { lat, lng } = e.latlng;
		const address = await fetchAddressByCoordinates(lat, lng);

		setTempMarker((prev) => (prev ? { ...prev, adress: address } : prev));
		setIsLoading(false);
	};

	return tempMarker === null ? null : (
		<Marker
			eventHandlers={{
				click: (e) => {
					getAddress(e);
				},
			}}
			position={tempMarker.position}
			icon={ new Icon({
										iconUrl: temporaryMarker,
										iconSize: [70, 70],
										iconAnchor: [35, 58],
										popupAnchor: [0, -60],
									}) 
				}
		>
			<Popup>{isLoading ? "Loading..." : tempMarker.adress}</Popup>
		</Marker>
	);
}
