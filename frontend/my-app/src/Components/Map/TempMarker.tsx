import { useState } from "react";
import type { MarkerI } from "../../interface/Marker";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { fetchAddressByCoordinates } from "../../action/MapAction";

export default function TempMarker() {
	const [tempMarker, setTempMarker] = useState<MarkerI | null>(null);

	useMapEvents({
		click(e) {
			const { lat, lng } = e.latlng;

			(async () => {
				const address = await fetchAddressByCoordinates(lat, lng);

				const newMarker: MarkerI = {
					title: "New Marker",
					timestamp: new Date().toISOString(),
					anonymity: true,
					category: "Category A",
					userId: "user123",
					status: "Pending approval",
					position: [lat, lng],
					adress: address,
				};

				setTempMarker(newMarker);
			})();
		},
	});

	return tempMarker === null ? null : (
		<Marker position={tempMarker.position}>
			<Popup>{tempMarker.adress}</Popup>
		</Marker>
	);
}
