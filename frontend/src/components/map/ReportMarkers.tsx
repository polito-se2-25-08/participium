import { useEffect, useState } from "react";
import type { MarkerI } from "../../interfaces/components/MarkerI";
import { divIcon, Icon, point } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import {
	chooseIcon,
	fetchActiveReports,
	fetchAddressByCoordinates,
} from "../../action/mapAction";
import MarkerClusterGroup from "react-leaflet-cluster";

interface MarkerListProps {
	Markers: MarkerI[] | null;
	setMarkers: React.Dispatch<React.SetStateAction<MarkerI[] | null>>;
	isDashboard?: boolean;
}

export function ReportMarkers({
	Markers,
	setMarkers,
	isDashboard = false,
}: MarkerListProps) {
	if (!isDashboard) {
		return null;
	}
	const [addresses, setAddresses] = useState<Record<number, string>>({});

	useEffect(() => {
		fetchActiveReports().then((data) => {
			setMarkers(data);
		});
	}, []);

	const createIcon = (cluster: any) => {
		return divIcon({
			html: `<div class="flex items-center justify-center rounded-full bg-amber-500/25 w-25 h-25 transform -translate-x-10 -translate-y-10 text-xl font-bold">${cluster.getChildCount()}</div>`,
			iconSize: point(60, 60, true),
			className: "",
		});
	};

	const handleMarkerClick = async (marker: MarkerI, idx: number) => {
		if (!addresses[idx]) {
			setAddresses((prev) => ({
				...prev,
				[idx]: "Searching address...",
			}));
			const address = await fetchAddressByCoordinates(
				marker.position[0],
				marker.position[1]
			);
			setAddresses((prev) => ({ ...prev, [idx]: address }));
		}
	};

	if (Markers === null) return null;

	return (
		<MarkerClusterGroup chunkedLoading iconCreateFunction={createIcon}>
			{Markers.map((marker, idx) => (
				<Marker
					key={idx}
					position={marker.position}
					icon={
						new Icon({
							iconUrl: chooseIcon(marker.category),
							iconSize: [35, 35],
							iconAnchor: [15, 30],
							popupAnchor: [0, -30],
						})
					}
					eventHandlers={{
						click: () => handleMarkerClick(marker, idx),
					}}
				>
					<Popup>
						<h2>{marker.title}</h2>
						<p>{addresses[idx] || "Searching address..."}</p>
						<p>Report time: {marker.timestamp}</p>
						<p>{marker.category}</p>
						<p>Status: {marker.status}</p>
						{marker.anonymity ? (
							<p>Reported Anonymously</p>
						) : (
							<p>Reported by User: {marker.userId}</p>
						)}
					</Popup>
				</Marker>
			))}
		</MarkerClusterGroup>
	);
}
