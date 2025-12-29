import { useNavigate } from "react-router-dom";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";

import ContentContainer from "../containers/ContentContainer";
import { useUser } from "../providers/AuthContext";

import { useEffect, useState } from "react";
import { fetchActiveReports } from "../../action/mapAction";
import { mapFetchedActiveReportsToActiveReports } from "../../mapper/ActiveReports";
import type { ClientReportMapI } from "../../interfaces/dto/report/NewReportResponse";
import SubTitle from "../titles/SubTitle";
import { formatTimestamp } from "../../utilis/utils";
import { MapWindow } from "../map/DashboardMap/MapWindow";
import UserReports from "./componets/UserReports";
import ReportPopupModal from "../modals/ReportPopupModal";

export default function Dashboard() {
	const navigate = useNavigate();

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
		<ContentContainer width="w-full sm:w-full xl:w-11/12" gap="xl:gap-2 gap-4">
			<div className="flex flex-row gap-5 w-full h-[80vh] items-stretch">
				<MapWindow
					className={`
						rounded-xl shadow-xl border border-gray-600 
						flex-[3] min-w-0 h-full`}
					scrollWheelZoom={false}
					reports={reports}
					setClickedReportId={setClickedReportId}
				/>

				{showRightPanel && (
					<div className="flex-[2] min-w-0 flex flex-col gap-5 h-full overflow-hidden">
						{isCitizen && <UserReports />}
					</div>
				)}
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

						{!clickedReport.anonymous ? (
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
									{clickedReport.reporterUsername}
								</span>
							</div>
						) : (
							<span className="text-base opacity-80">
								This report is anonymous
							</span>
						)}

						<span className="border-b-2 my-2 block"></span>
						<div className="text-base opacity-80">{clickedReport.description}</div>

						<SubTitle fontSize="text-[1.3rem]" textStart>
							Photos
						</SubTitle>
						<span className="border-b-2 my-2 block"></span>

						<div className="flex flex-wrap gap-4">
							{clickedReport.photos.map((photo, idx) => (
								<img
									className="h-36 w-36 object-cover rounded-lg"
									src={photo}
									key={photo ?? idx}
									alt="report"
								/>
							))}
						</div>
					</div>
				)}
			</ReportPopupModal>

			{isCitizen && (
				<PrimaryButton className="rounded-xl mt-2" onClick={() => navigate("/report")}>
					Submit a Report
				</PrimaryButton>
			)}
		</ContentContainer>
	);
}
