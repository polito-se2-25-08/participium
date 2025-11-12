import { useMapEvents } from "react-leaflet";
import type { MarkerI } from "../../interface/Marker";

interface MapClickHandlerProps {
	tempMarker: MarkerI | null;
	setTempMarker: React.Dispatch<React.SetStateAction<MarkerI | null>>;
}
export default function MapClickHandler({
	tempMarker,
	setTempMarker,
}: MapClickHandlerProps) {
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
	return null;
}
