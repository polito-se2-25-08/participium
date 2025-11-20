import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { fetchCoordinates } from "../../action/MapAction";
import L from "leaflet";
import type { MarkerI } from "../../interfaces/components/Marker";

const ZOOM = import.meta.env.VITE_MAP_ZOOM;

interface SearchLocationInputProps {
	setMarker: React.Dispatch<React.SetStateAction<MarkerI | null>>;
}
export default function SearchLocationInput({
	setMarker,
}: SearchLocationInputProps) {
	const map = useMap();
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (formRef.current) {
			L.DomEvent.disableClickPropagation(formRef.current);
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const address = formData.get("address") as string;
		if (address) {
			const coords = await fetchCoordinates(address);
			if (coords) {
				map.setView(coords, ZOOM);
				const newMarker: MarkerI = {
					title: "New Marker",
					timestamp: new Date().toISOString(),
					anonymity: true,
					category: "Category A",
					userId: "user123",
					status: "Pending approval",
					position: coords,
					adress: "",
				};

				setMarker(newMarker);
			}
		}
	};

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit}
			style={{
				position: "absolute",
				top: "10px",
				left: "50px",
				zIndex: 1000,
				backgroundColor: "white",
				padding: "10px",
				borderRadius: "5px",
			}}
		>
			<input
				type="text"
				name="address"
				placeholder="Search location..."
				style={{ padding: "5px", marginRight: "5px" }}
			/>
			<button type="submit">Search</button>
		</form>
	);
}
