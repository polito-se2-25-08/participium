import { MapContainer, TileLayer } from "react-leaflet";
import { type LatLngBoundsExpression } from "leaflet";

import { useState } from "react";

import "leaflet/dist/leaflet.css";
import MapClickHandler from "./MapClickHandler";

import { ReportMarkers } from "./ReportMarkers";
import TempMarker from "./TempMarker";
import SearchLocationInput from "./SearchLocationInput";
import type { ClientReportMapI } from "../../../interfaces/dto/report/NewReportResponse";
import type { MarkerI } from "../../../interfaces/components/MarkerI";
import { MarkerInfo } from "./MarkerInfo";
import UserReports from "../../pages/componets/UserReports";
import type { UserReport } from "../../../interfaces/dto/report/UserReport";
import ActiveReportsList from "../../pages/componets/ActiveReportsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

const ZOOM = 13;
const TURIN_BOUNDS: LatLngBoundsExpression = [
	[44.96, 7.5],
	[45.18, 7.8],
];

interface ReportMapViewProps {
	className?: string;
	scrollWheelZoom?: boolean;
	isReport?: boolean;
	reports: ClientReportMapI[];
	setAdress?: React.Dispatch<React.SetStateAction<string>>;
	setLocation?: React.Dispatch<React.SetStateAction<[number, number] | null>>;
	setClickedReportId: React.Dispatch<React.SetStateAction<number>>;
	showRightPanel?: boolean;
	isCitizen?: boolean;
    isUnlogged?: boolean;
}

export function MapWindow({
	className,
	scrollWheelZoom = true,
	isReport = false,
	reports,
	setAdress,
	setLocation,
	isCitizen,
    isUnlogged,

	setClickedReportId,
}: ReportMapViewProps) {
	const [tempMarker, setTempMarker] = useState<MarkerI | null>(null);
	const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);
	const [userReports, setUserReports] = useState<UserReport[]>([]);
    const [activeReportsOpen, setActiveReportsOpen] = useState<boolean>(false);

	return (
		<div className="relative w-full h-full">
			<MapContainer
				center={[45.0703, 7.6869]}
				zoom={ZOOM}
				minZoom={12}
				className={className}
				scrollWheelZoom={scrollWheelZoom}
				maxBounds={TURIN_BOUNDS}
				maxBoundsViscosity={1.0}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<MapClickHandler
					tempMarker={tempMarker}
					setTempMarker={setTempMarker}
					setAdress={setAdress}
					setLocation={setLocation}
				/>
				{!isReport && <SearchLocationInput setMarker={setTempMarker} />}
				<ReportMarkers
					reports={reports}
					isDashboard={!isReport}
					setClickedReportId={setClickedReportId}
				/>
				<TempMarker tempMarker={tempMarker} setTempMarker={setTempMarker} />
				<MarkerInfo />
			</MapContainer>
			{rightPanelOpen && isCitizen && (
			<div className="absolute top-0 right-0 w-full sm:w-[28rem] md:w-[32rem] lg:w-[36rem] h-full shadow-lg z-[1000] overflow-hidden">
				<UserReports 
				setRightPanelOpen ={setRightPanelOpen}
				userReports={userReports}
				setUserReports={setUserReports}
				/>
			</div>
			)}
			{!rightPanelOpen && isCitizen && (
				<div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-[1000]">
					<button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="w-18 h-18 rounded-full flex items-center justify-center bg-white shadow-lg hover:bg-gray-100 cursor-pointer transition-colors duration-300">
						Your reports
					</button>
				</div>
			)}

            {isUnlogged && activeReportsOpen && (
                <div className="absolute top-0 right-0 w-full sm:w-[24rem] h-full shadow-lg z-[1000] overflow-hidden bg-white">
                     <div className="relative h-full w-full">
                        <ActiveReportsList reports={reports} onReportClick={setClickedReportId} />
                        <button 
                            onClick={() => setActiveReportsOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800 transition-colors"
                            aria-label="Close active reports"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                     </div>
                </div>
            )}

            {isUnlogged && !activeReportsOpen && (
                <div className="absolute top-2 right-20 z-[999]">
                    <button 
                        onClick={() => setActiveReportsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-full shadow-lg hover:bg-gray-50 transition-colors font-medium border border-gray-200"
                    >
                         <FontAwesomeIcon icon={faList} />
                         <span>View Reports</span>
                    </button>
                </div>
            )}
		</div>
	);
}
