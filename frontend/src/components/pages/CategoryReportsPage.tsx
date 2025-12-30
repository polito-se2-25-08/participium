import { useCallback, useEffect, useMemo, useState } from "react";
import ContentContainer from "../containers/ContentContainer";
import PageTitle from "../titles/PageTitle";
import SubTitle from "../titles/SubTitle";
import LoadingState from "../states/LoadingState";
import ErrorState from "../states/ErrorState";
import ReportReviewCard from "../cards/ReportReviewCard";
import { reportService } from "../../api/reportService";
import { externalCompanyService } from "../../api/externalcompanyService";
import { useUser } from "../providers/AuthContext";
import type { ReportDTO } from "../../interfaces/dto/report/ReportDTO.ts";
import { postPublicMessage } from "../../action/reportAction.ts";

export default function CategoryReportsPage() {
	const { user } = useUser();
	const [processingReportId, setProcessingReportId] = useState<number | null>(
		null
	);

	const [reports, setReports] = useState<ReportDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isError, setIsError] = useState(false);

	const fetchReports = useCallback(async () => {
		setIsLoading(true);
		setIsError(false);
		setErrorMessage(null);
		try {
			const response = await reportService.getTechnicianReports();
			if (!response.success) {
				setIsError(true);
				setErrorMessage(response.data?.message ?? "Failed to fetch reports");
				setReports([]);
				return;
			}

			setReports(response.data || []);
		} catch (e) {
			setIsError(true);
			setErrorMessage(
				e instanceof Error ? e.message : "Failed to fetch reports"
			);
			setReports([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchReports();
	}, [fetchReports]);

	const reportsByCategory = useMemo(() => {
		const map = new Map<string, ReportDTO[]>();
		for (const report of reports) {
			const category = report.category?.category ?? "Unknown";
			const existing = map.get(category);
			if (existing) existing.push(report);
			else map.set(category, [report]);
		}
		return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
	}, [reports]);

	const currentCategoriesLabel = useMemo(() => {
		const categories = reportsByCategory
			.map(([category]) => category)
			.filter((c) => c !== "Unknown");
		if (categories.length === 0) return null;
		return categories.length === 1
			? `Current category: ${categories[0]}`
			: `Current categories: ${categories.join(", ")}`;
	}, [reportsByCategory]);

	const renderReportCard = (report: ReportDTO) => {
		// ASSIGNED reports – start/suspend/resolve/assign external
		if (report.status === "ASSIGNED") {
			return (
				<ReportReviewCard
					key={report.id}
					report={report}
					externalAssigned={report.assignedExternalOfficeId !== null}
					onApprove={handleStart}
					onReject={handleResolve}
					onSuspend={handleSuspend}
					onAssignExternal={handleAssignExternal}
					isProcessing={processingReportId === report.id}
					approveLabel="Start Report"
					rejectLabel="Resolve Report"
					suspendLabel="Suspend Report"
					hideRejectWhenSuspended={true}
					hideAssignExternalWhenSuspended={true}
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
				externalAssigned={report.assignedExternalOfficeId !== null}
				onApprove={handleToggleStatus}
				onReject={handleResolve}
				onAssignExternal={handleAssignExternal}
				isProcessing={processingReportId === report.id}
				approveLabel={
					report.status === "SUSPENDED" ? "Resume Report" : "Suspend Report"
				}
				rejectLabel="Resolve Report"
				hideRejectWhenSuspended={true}
				hideAssignExternalWhenSuspended={true}
				allowInternalComments={true}
				allowMessages={true}
				onSendMessage={handleSendMessage}
			/>
		);
	};

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
			if (result.success) await fetchReports();
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
			if (result.success) await fetchReports();
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
			if (result.success) await fetchReports();
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
			if (result.success) await fetchReports();
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

		await postPublicMessage(reportId, message, user.id);
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
	if (isError)
		return <ErrorState error={errorMessage ?? "Sometimes went wrong"} />;

	if (reports.length === 0) {
		return (
			<ContentContainer
				width="xl:w-5/6 sm:w-full"
				gap="gap-6"
				padding="p-5"
			>
				<div className="">
					<div className="mt-2">
						<PageTitle>Category Reports</PageTitle>
					</div>
					<div className="mt-1">
						<SubTitle className="opacity-90">
							Overview of reports assigned to your category
						</SubTitle>
					</div>
				</div>
				<p className="text-center text-gray-500 py-8">
					No reports found
				</p>
			</ContentContainer>
		);
	}

	return (
		<ContentContainer width="xl:w-5/6 sm:w-full" gap="gap-6" padding="p-5">
			<div className="">
				<div className="mt-2">
					<PageTitle>Category Reports</PageTitle>
				</div>
				<div className="mt-1">
					<SubTitle className="opacity-90">
						Overview of reports assigned to your category
					</SubTitle>
				</div>
				{currentCategoriesLabel && (
					<div className="mt-3 flex justify-center">
						<span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-base font-semibold text-[#2c3e50]">
							{currentCategoriesLabel}
						</span>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-6">
				<p className="text-sm text-gray-600">
					{reports.length} report{reports.length !== 1 ? "s" : ""} in queue
				</p>

				{reportsByCategory.map(([category, categoryReports]) => (
					<div key={category} className="flex flex-col gap-4">
						<div className="flex items-baseline justify-between">
							<h2 className="text-lg font-semibold text-gray-800">
								{category}
							</h2>
							<p className="text-sm text-gray-600">
								{categoryReports.length} report
								{categoryReports.length !== 1 ? "s" : ""}
							</p>
						</div>

						{categoryReports.map(renderReportCard)}
					</div>
				))}
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
										await fetchReports();
										setAssignModalOpen(false);
										return;
									}

									if (value !== "") {
										await externalCompanyService.assignExternalOffice(
											assigningReport,
											Number(value)
										);
										await fetchReports();
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
