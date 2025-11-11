import { useState } from "react";
import type { MarkerI } from "../../interface/Marker";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { fetchAddressByCoordinates } from "../../action/MapAction";
import type { LeafletMouseEvent } from "leaflet";

export default function TempMarker() {
	const [tempMarker, setTempMarker] = useState<MarkerI | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useMapEvents({
		click(e) {
			if (tempMarker) {
				setTempMarker(null);
				return;
			}
			const { lat, lng } = e.latlng;

			(async () => {
				const newMarker: MarkerI = {
					title: "New Marker",
					timestamp: new Date().toISOString(),
					anonymity: true,
					category: "Category A",
					userId: "user123",
					status: "Pending approval",
					position: [lat, lng],
					adress: "",
				};

				setTempMarker(newMarker);
			})();
		},
	});

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
		>
			<Popup>{isLoading ? "Loading..." : tempMarker.adress}</Popup>
		</Marker>
	);
}
