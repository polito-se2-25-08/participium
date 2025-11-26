import { useMapEvents } from "react-leaflet";
import { fetchAddressByCoordinates } from "../../action/mapAction";
import type { MarkerI } from "../../interfaces/components/MarkerI";

interface MapClickHandlerProps {
	tempMarker: MarkerI | null;
	setTempMarker: React.Dispatch<React.SetStateAction<MarkerI | null>>;
	setAdress: React.Dispatch<React.SetStateAction<string>> | undefined;
	setLocation?: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}
export default function MapClickHandler({
	tempMarker,
	setTempMarker,
	setAdress,
	setLocation,
}: MapClickHandlerProps) {
	const getAddress = async (lng: number, lat: number) => {
		const address = await fetchAddressByCoordinates(lat, lng);
		return address;
	};

	useMapEvents({
		click: async (e) => {
			if (tempMarker) {
				setTempMarker(null);
				return;
			}

			const { lat, lng } = e.latlng;

			if (setLocation) {
				setLocation([lat, lng]);
			}
			const adress = await getAddress(lng, lat);

			if (setAdress) {
				setAdress(adress);
			}

			const newMarker: MarkerI = {
				title: "New Marker",
				timestamp: new Date().toISOString(),
				anonymity: true,
				category: "Category A",
				userId: "user123",
				status: "Pending approval",
				position: [lat, lng],
				adress: adress,
			};

			setTempMarker(newMarker);
		},
	});

	return null;
}
