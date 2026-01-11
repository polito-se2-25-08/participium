import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { Icon, type LeafletMouseEvent } from "leaflet";

import temporaryMarker from "../../../assets/markers/temp_marker.svg";
import { fetchAddressByCoordinates } from "../../../action/mapAction";
import type { MarkerI } from "../../../interfaces/components/MarkerI";
import { useNavigate } from "react-router-dom";
import OutlinePrimaryButton from "../../buttons/variants/primary/OutlinePrimaryButton";

interface TempMarkerProps {
	tempMarker: MarkerI | null;
	setTempMarker: React.Dispatch<React.SetStateAction<MarkerI | null>>;
	isCitizen?: boolean;
}
export default function TempMarker({
	tempMarker,
	setTempMarker,
	isCitizen,
}: TempMarkerProps) {
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const getAddress = async (e: LeafletMouseEvent) => {
		setIsLoading(true);
		const { lat, lng } = e.latlng;
		const address = await fetchAddressByCoordinates(lat, lng);

		setTempMarker((prev) => (prev ? { ...prev, address: address } : prev));
		setIsLoading(false);
	};
	

	const createReport = () =>
	{
		navigate("/report", {state: {location: tempMarker?.position, address: tempMarker?.address}});
	}

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
			<Popup>
				{isLoading && "Loading..."}
				{!isLoading && (
					<>
						{tempMarker.address}
						<br />
						{isCitizen && tempMarker.address !== "Address not found" && <OutlinePrimaryButton onClick={createReport}>Create a report</OutlinePrimaryButton>}
					</>
				)}

			</Popup>
		</Marker>
	);
}
