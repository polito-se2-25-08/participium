import { useEffect, useState } from "react";
import ContentContainer from "../containers/ContentContainer";
import PageTitle from "../titles/PageTitle";
import SubTitle from "../titles/SubTitle";
import LoadingState from "../states/LoadingState";
import ErrorState from "../states/ErrorState";
import ReportReviewCard from "../cards/ReportReviewCard";
import { useCategoryReports } from "../../hooks/useCategoryReports";
import { reportService } from "../../api/reportService";
import { externalCompanyService } from "../../api/externalcompanyService";
import { CATEGORY_NAME_TO_ID } from "../../constants/index.ts";
import { useUser } from "../providers/AuthContext";
import type { ReportDTO } from "../../interfaces/dto/report/ReportDTO.ts";
import { postPublicMessage } from "../../action/reportAction.ts";

export default function CategoryReportsPage() {
	const { refetch } = useCategoryReports();
	const { user } = useUser();
	const [processingReportId, setProcessingReportId] = useState<number | null>(
		null
	);

	const [reports, setReports] = useState<ReportDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const init = async () => {
			setIsLoading(true);
			const response = await reportService.getTechnicianReports();
			console.log(response);

			if (response.success) {
				console.log("Fetched reports:", response.data);
				setReports(response.data);
			}

			setIsLoading(false);
		};

		init();
	}, []);

	const [assignModalOpen, setAssignModalOpen] = useState(false);
	const [assigningReport, setAssigningReport] = useState<number | null>(null);
	const [companyOptions, setCompanyOptions] = useState<any[]>([]);

	const handleStart = async (reportId: number) => {
		try {
			setProcessingReportId(reportId);
			const result = await reportService.updateReportStatus(
				reportId,
				"IN_PROGRESS"
			);
			if (result.success) refetch();
		} finally {
			setProcessingReportId(null);
		}
	};

	const handleSuspend = async (reportId: number) => {
		try {
			setProcessingReportId(reportId);
			const result = await reportService.updateReportStatus(
				reportId,
				"SUSPENDED"
			);
			if (result.success) refetch();
		} finally {
			setProcessingReportId(null);
		}
	};

	const handleToggleStatus = async (reportId: number) => {
		try {
			setProcessingReportId(reportId);

			const currentReport = reports.find((r) => r.id === reportId);
			const currentStatus = currentReport?.status;

			const newStatus =
				currentStatus === "IN_PROGRESS" ? "SUSPENDED" : "IN_PROGRESS";

			const result = await reportService.updateReportStatus(
				reportId,
				newStatus
			);
			if (result.success) refetch();
		} finally {
			setProcessingReportId(null);
		}
	};

	const handleResolve = async (reportId: number) => {
		try {
			setProcessingReportId(reportId);
			const result = await reportService.updateReportStatus(
				reportId,
				"RESOLVED"
			);
			if (result.success) refetch();
		} finally {
			setProcessingReportId(null);
		}
	};

	const handleSendMessage = async (reportId: number, message: string) => {
		if (!user) return;
		const newMessage = {
			id: 0,
			sender_id: user.id,
			report_id: reportId,
			message: message,
			created_at: new Date().toISOString(),
			is_public: true,
			sender: {
				id: user.id,
				name: user.name,
				surname: user.surname,
				username: user.username,
				profile_picture: user.profilePicture,
			},
		};

		setReports((prevReports) =>
			prevReports.map((report) =>
				report.id === reportId
					? {
							...report,
							publicMessages: [
								...(report.publicMessages || []),
								{
									id: newMessage.id,
									reportId: newMessage.report_id,
									senderId: newMessage.sender_id,
									message: newMessage.message,
									createdAt: newMessage.created_at,
									sender: {
										id: newMessage.sender.id,
										name: newMessage.sender.name,
										surname: newMessage.sender.surname,
										username: newMessage.sender.username,
										profilePicture:
											newMessage.sender.profile_picture,
									},
								},
							],
					  }
					: report
			)
		);

		const response = await postPublicMessage(reportId, message, user.id);
	};

	// =============================
	//      ASSIGN EXTERNAL MODAL
	// =============================
	const handleAssignExternal = async (reportId: number) => {
		try {
			setProcessingReportId(reportId);

			const report = reports.find((r) => r.id === reportId);
			if (!report) return;

			const companies =
				await externalCompanyService.getCompaniesByCategory(
					report.category.id
				);

			if (!companies.success) {
				alert("Failed to fetch external offices.");
				return;
			}

			setCompanyOptions(companies.data || []);
			setAssigningReport(reportId);
			setAssignModalOpen(true);
		} catch (err) {
			console.error(err);
		} finally {
			setProcessingReportId(null);
		}
	};

	// =============================
	//      PAGE STATES
	// =============================

	if (isLoading) return <LoadingState />;
	if (isError) return <ErrorState error={"Sometimes went wrong"} />;

	if (reports.length === 0) {
		return (
			<ContentContainer
				width="xl:w-5/6 sm:w-full"
				gap="gap-6"
				padding="p-5"
			>
				<PageTitle>Category Reports</PageTitle>
				<SubTitle>
					Overview of reports assigned to your category
				</SubTitle>
				<p className="text-center text-gray-500 py-8">
					No reports found
				</p>
			</ContentContainer>
		);
	}

	return (
		<ContentContainer width="xl:w-5/6 sm:w-full" gap="gap-6" padding="p-5">
			<PageTitle>Category Reports</PageTitle>
			<SubTitle>Overview of reports assigned to your category</SubTitle>

			<div className="flex flex-col gap-4">
				<p className="text-sm text-gray-600">
					{reports.length} report{reports.length !== 1 ? "s" : ""} in
					queue
				</p>

				{reports.map((report) => {
					// ASSIGNED reports – start/suspend/resolve/assign external
					if (report.status === "ASSIGNED") {
						return (
							<ReportReviewCard
								key={report.id}
								report={report}
								externalAssigned={
									report.assignedExternalOfficeId !== null
								}
								onApprove={handleStart}
								onReject={handleResolve}
								onSuspend={handleSuspend}
								onAssignExternal={handleAssignExternal}
								isProcessing={processingReportId === report.id}
								approveLabel="Start Report"
								rejectLabel="Resolve Report"
								suspendLabel="Suspend Report"
								allowInternalComments={true}
								allowMessages={true}
								onSendMessage={handleSendMessage}
							/>
						);
					}

					// Other statuses – toggle + resolve + assign external
					return (
						<ReportReviewCard
							key={report.id}
							report={report}
							externalAssigned={
								report.assignedExternalOfficeId !== null
							}
							onApprove={handleToggleStatus}
							onReject={handleResolve}
							onAssignExternal={handleAssignExternal}
							isProcessing={processingReportId === report.id}
							approveLabel={
								report.status === "SUSPENDED"
									? "Resume Report"
									: "Suspend Report"
							}
							rejectLabel="Resolve Report"
							allowInternalComments={true}
							allowMessages={true}
							onSendMessage={handleSendMessage}
						/>
					);
				})}
			</div>

			{/* ===========================
          ASSIGN EXTERNAL MODAL UI
         =========================== */}
			{assignModalOpen && (
				<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded shadow-lg w-96">
						<h2 className="text-lg font-semibold mb-4">
							Assign External Company
						</h2>

						<select
							className="w-full border p-2 rounded"
							defaultValue=""
							id="company-select"
						>
							<option value="">-- Select an office --</option>

							{companyOptions.map((c: any) => (
								<option key={c.id} value={c.id}>
									{c.company_name}
									{c.category ? ` (${c.category})` : ""}
								</option>
							))}

							{/* UNASSIGN OPTION */}
							<option value="UNASSIGN">
								❌ Unassign external company
							</option>
						</select>

						<div className="flex justify-end gap-3 mt-4">
							<button
								className="px-4 py-2 bg-gray-300 rounded"
								onClick={() => setAssignModalOpen(false)}
							>
								Cancel
							</button>

							<button
								className="px-4 py-2 bg-blue-600 text-white rounded"
								onClick={async () => {
									const select = document.getElementById(
										"company-select"
									) as HTMLSelectElement;
									const value = select.value;

									if (!assigningReport) return;

									if (value === "UNASSIGN") {
										await externalCompanyService.assignExternalOffice(
											assigningReport,
											null
										);
										await refetch();
										setAssignModalOpen(false);
										return;
									}

									if (value !== "") {
										await externalCompanyService.assignExternalOffice(
											assigningReport,
											Number(value)
										);
										await refetch();
									}

									setAssignModalOpen(false);
								}}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</ContentContainer>
	);
}
