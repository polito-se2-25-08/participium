import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapCenterUpdaterProps {
	center?: [number, number];
}

export default function MapCenterUpdater({ center }: MapCenterUpdaterProps) {
	const map = useMap();

	useEffect(() => {
		if (center) {
			map.setView(center, map.getZoom());
		}
	}, [center, map]);

	return null;
}
