import { useNavigate } from "react-router-dom";

import PageTitle from "../titles/PageTitle";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";

import ContentContainer from "../containers/ContentContainer";
import { useUser } from "../providers/AuthContext";

import { useEffect, useState } from "react";
import ReportMapInfoContainer from "../containers/ReportMapInfoContainer";
import DangerButton from "../buttons/variants/danger/DangerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { fetchActiveReports } from "../../action/mapAction";
import { mapFetchedActiveReportsToActiveReports } from "../../mapper/ActiveReports";
import type { ClientReportMapI } from "../../interfaces/dto/report/NewReportResponse";
import SubTitle from "../titles/SubTitle";
import { formatTimestamp } from "../../utilis/utils";
import { MapWindow } from "../map/DashboardMap/MapWindow";

export default function Dashboard() {
	const navigate = useNavigate();

	const [isReportOpen, setIsReportOpen] = useState(false);
	const [reports, setReports] = useState<ClientReportMapI[] | []>([]);

	const [clickedReportId, setClickedReportId] = useState<number>(-1);

	const [clickedReport, setClickedReport] = useState<ClientReportMapI | null>(
		null
	);

	useEffect(() => {
		if (clickedReportId !== -1) {
			setIsReportOpen(true);
			const report = reports.find(
				(report) => report.id === clickedReportId
			);
			if (report) {
				setClickedReport(report);
			}
		} else {
			setIsReportOpen(false);
		}
	}, [clickedReportId]);

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

	return (
		<ContentContainer width="xl:w-5/6 sm:w-1/2 " gap="xl:gap-2 gap-4">
			<PageTitle>Participium</PageTitle>

			<p className="opacity-50 text-center">
				Citizen Participation in Urban Environment Management
			</p>
			<div className="flex flex-row gap-5">
				<MapWindow
					className={`
						rounded-xl shadow-xl border border-gray-600 
						${isReportOpen ? "w-2/3" : "w-full"} 
						w-full h-full min-h-[70vh]`}
					scrollWheelZoom={false}
					reports={reports}
					setClickedReportId={setClickedReportId}
				/>

				{isReportOpen && (
					<ReportMapInfoContainer>
						{clickedReport && (
							<div className="flex flex-col pt-4 mb-3">
								<SubTitle>{clickedReport.title}</SubTitle>
								<div className="flex flex-col overflow-scroll max-h-[50vh] pl-5 pr-5 pb-4 w-full">
									<SubTitle>Reporter</SubTitle>
									{!clickedReport.anonymous ? (
										<div className="flex flex-row items-center justify-center gap-5">
											{clickedReport.reporterProfilePicture && (
												<img
													className="h-35 w-35 rounded-2xl"
													src={
														`data:image/png;base64,` +
														clickedReport.reporterProfilePicture
													}
													alt="Reporter profile picture"
												/>
											)}
											<span className="text-center text-2xl font-semibold">
												{clickedReport.reporterUsername}
											</span>
										</div>
									) : (
										<span>This report is anonymous</span>
									)}

									<span className="border-b-2 mb-2 mt-2"></span>

									<div>{clickedReport.description}</div>

									<span className="border-b-2 mb-2 mt-2"></span>
									<div className="flex flex-wrap gap-4">
										{clickedReport.photos.map((photo) => (
											<img
												className="h-32 w-32 object-cover"
												src={photo}
												key={photo}
											/>
										))}
									</div>
									<span className="text-end">
										{formatTimestamp(
											clickedReport.timestamp
										)}
									</span>
								</div>
							</div>
						)}

						<div className="flex flex-row justify-end p-4">
							<DangerButton
								onClick={() => {
									setIsReportOpen(false);
									setClickedReportId(-1);
								}}
							>
								<FontAwesomeIcon icon={faX} />
							</DangerButton>
						</div>
					</ReportMapInfoContainer>
				)}
			</div>
			{user.role === "CITIZEN" && (
				<PrimaryButton onClick={() => navigate("/report")}>
					Submit a report
				</PrimaryButton>
			)}
		</ContentContainer>
	);
}
