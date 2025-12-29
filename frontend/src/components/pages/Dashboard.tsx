import { useNavigate } from "react-router-dom";

import ContentContainer from "../containers/ContentContainer";
import { useUser } from "../providers/AuthContext";

import { useEffect, useState } from "react";
import { fetchActiveReports } from "../../action/mapAction";
import { mapFetchedActiveReportsToActiveReports } from "../../mapper/ActiveReports";
import type { ClientReportMapI } from "../../interfaces/dto/report/NewReportResponse";
import SubTitle from "../titles/SubTitle";
import { formatTimestamp } from "../../utilis/utils";
import { MapWindow } from "../map/DashboardMap/MapWindow";
import ReportPopupModal from "../modals/ReportPopupModal";
import ImageZoomModal from "../modals/ImageZoomModal";

export default function Dashboard() {

	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const [reports, setReports] = useState<ClientReportMapI[] | []>([]);

	const [clickedReportId, setClickedReportId] = useState<number>(-1);

	const [clickedReport, setClickedReport] = useState<ClientReportMapI | null>(
		null
	);

	useEffect(() => {
		if (clickedReportId !== -1) {
			const report = reports.find(
				(report) => report.id === clickedReportId
			);
			if (report) {
				setClickedReport(report);
			} else {
				setClickedReport(null);
			}
		} else {
			setClickedReport(null);
		}
	}, [clickedReportId, reports]);

	useEffect(() => {
		const fetchReports = async () => {
			const fetchedData = await fetchActiveReports();
			if (fetchedData.success) {
				const data = mapFetchedActiveReportsToActiveReports(
					fetchedData.data
				);

				setReports(data);
			}
		};

		fetchReports();
	}, []);

	const { user } = useUser();
	const isCitizen = user?.role === "CITIZEN";
	const showRightPanel = isCitizen;
	const isMapReportOpen = clickedReportId !== -1 && clickedReport != null;
	const closeMapReportModal = () => {
		setClickedReportId(-1);
		setClickedReport(null);
	};

	return (
		<ContentContainer width="w-full sm:w-full" gap="xl:gap-2 gap-4">
			<div className="gap-5 w-full h-[calc(100vh-4rem)] items-stretch">
				<MapWindow
					className={`
						flex-[3] min-w-0 h-full`}
					scrollWheelZoom={false}
					reports={reports}
					setClickedReportId={setClickedReportId}
					showRightPanel={showRightPanel}
					isCitizen={isCitizen}
				/>	
			</div>

			<ReportPopupModal
				isOpen={isMapReportOpen}
				onClose={closeMapReportModal}
				header={
					clickedReport ? (
						<>
							<SubTitle fontSize="text-[1.5rem]" textStart className="!truncate">
								{clickedReport.title}
							</SubTitle>
							<span className="text-sm opacity-60">
								{formatTimestamp(clickedReport.timestamp)}
							</span>
						</>
					) : null
				}
			>
				{clickedReport && (
					<div className="flex flex-col gap-4">
						<SubTitle fontSize="text-[1.3rem]" textStart>
							Reporter
						</SubTitle>
						<span className="border-b-2 my-2 block"></span>


						{clickedReport.anonymous && isCitizen ? (
							<span className="text-base opacity-80">
								This report is anonymous
							</span>
							
						) : (
						<div className="flex flex-row items-center justify-center gap-5">
								{clickedReport.reporterProfilePicture && (
									<img
										className="h-36 w-36 rounded-2xl"
										src={
											`data:image/png;base64,` +
											clickedReport.reporterProfilePicture
										}
										alt="Reporter profile picture"
									/>
								)}
								<span className="text-center text-3xl font-semibold">
									{clickedReport.reporterName} {clickedReport.reporterSurname}
								</span>
							</div>
						)}

						<span className="border-b-2 my-2 block"></span>
						<div className="text-base opacity-80">{clickedReport.description}</div>

						<SubTitle fontSize="text-[1.3rem]" textStart>
							Photos
						</SubTitle>
						<span className="border-b-2 my-2 block"></span>

						<div className="flex flex-wrap gap-4">
							{clickedReport.photos.map((photo, idx) => (
								<button
												key={idx}
												type="button"
												onClick={() => setSelectedImage(photo)}
												className="rounded-lg overflow-hidden border border-gray-300 bg-white hover:opacity-90 transition-opacity"
												aria-label={`Open report photo ${idx + 1}`}
											>
												<img
													src={photo}
													alt={`Report photo ${idx + 1}`}
													className="w-full h-24 object-cover"
												/>
											</button>
							))}
						</div>
					</div>
				)}
				<ImageZoomModal
								isOpen={selectedImage !== null}
								imageUrl={selectedImage || ""}
								onClose={() => setSelectedImage(null)}
								altText="Report photo"
							/>
			</ReportPopupModal>
		</ContentContainer>
	);
}
