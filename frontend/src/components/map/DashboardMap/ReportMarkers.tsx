import { useEffect, useState } from "react";

import { divIcon, Icon, point } from "leaflet";
import { Marker } from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";
import type { ClientReportMapI } from "../../../interfaces/dto/report/NewReportResponse";
import {
	chooseIcon,
	fetchAddressByCoordinates,
} from "../../../action/mapAction";

interface MarkerListProps {
	reports: ClientReportMapI[] | null;
	isDashboard?: boolean;

	setClickedReportId: React.Dispatch<React.SetStateAction<number>>;
}

export function ReportMarkers({
	reports,
	isDashboard = false,

	setClickedReportId,
}: MarkerListProps) {
	if (!isDashboard) {
		return null;
	}
	const [addresses, setAddresses] = useState<Record<number, string>>({});

	const createIcon = (cluster: any) => {
		return divIcon({
			html: `<div class="flex items-center justify-center rounded-full bg-amber-500/25 w-25 h-25 transform -translate-x-10 -translate-y-10 text-xl font-bold">${cluster.getChildCount()}</div>`,
			iconSize: point(60, 60, true),
			className: "",
		});
	};

	useEffect(() => {
		console.log(reports);
	}, [reports]);

	const handleMarkerClick = async (report: ClientReportMapI, idx: number) => {
		if (!addresses[idx]) {
			setAddresses((prev) => ({
				...prev,
				[idx]: "Searching address...",
			}));
			const address = await fetchAddressByCoordinates(
				report.latitude,
				report.longitude
			);
			setAddresses((prev) => ({ ...prev, [idx]: address }));
		}
		setClickedReportId(report.id);
	};

	if (reports === null) return null;

	return (
		<MarkerClusterGroup chunkedLoading iconCreateFunction={createIcon}>
			{reports.map((report, idx) => (
				<Marker
					key={idx}
					position={report.coordinates}
					icon={
						new Icon({
							iconUrl: chooseIcon(report.category),
							iconSize: [35, 35],
							iconAnchor: [15, 30],
							popupAnchor: [0, -30],
						})
					}
					eventHandlers={{
						click: () => handleMarkerClick(report, idx),
					}}
				></Marker>
			))}
		</MarkerClusterGroup>
	);
}
