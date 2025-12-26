import { useNavigate } from "react-router-dom";
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
import UserReports from "./componets/UserReports";

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
	const isCitizen = user?.role === "CITIZEN";
	const showRightPanel = isReportOpen || isCitizen;

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
						{isReportOpen && (
							<ReportMapInfoContainer>
							{clickedReport && (
								<div className="flex flex-col pt-6 mb-3">
									<SubTitle>{clickedReport.title}</SubTitle>
									<div className="flex flex-col overflow-scroll max-h-[58vh] pl-6 pr-6 pb-5 w-full">
										<SubTitle>Reporter</SubTitle>
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
											<span>This report is anonymous</span>
										)}

									<span className="border-b-2 mb-2 mt-2"></span>

									<div>{clickedReport.description}</div>

									<span className="border-b-2 mb-2 mt-2"></span>
										<div className="flex flex-wrap gap-4">
										{clickedReport.photos.map((photo) => (
											<img
													className="h-36 w-36 object-cover rounded-lg"
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
						{isCitizen && <UserReports />}
					</div>
				)}
			</div>
			{isCitizen && (
				<PrimaryButton className="rounded-xl mt-2" onClick={() => navigate("/report")}>
					Submit a Report
				</PrimaryButton>
			)}
		</ContentContainer>
	);
}
