import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { fetchCoordinates } from "../../action/MapAction";
import L from "leaflet";

const ZOOM = import.meta.env.VITE_MAP_ZOOM;

export default function SearchLocationInput() {
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
