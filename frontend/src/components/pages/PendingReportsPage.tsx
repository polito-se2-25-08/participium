import ContentContainer from "../containers/ContentContainer";
import PageTitle from "../titles/PageTitle";
import SubTitle from "../titles/SubTitle";
import RejectionModal from "../modals/RejectionModal";
import LoadingState from "../states/LoadingState";
import ErrorState from "../states/ErrorState";
import ReportList from "../lists/ReportList";

import { useEffect, useState } from "react";
import type { ReportDTO } from "../../interfaces/dto/report/ReportDTO";
import { reportService } from "../../api/reportService";
import { NotificationToast } from "../NotificationToast";

export default function PendingReportsPage() {
	const [loading, setLoading] = useState(true);
	const [reports, setReports] = useState<ReportDTO[]>([]);
	const [error, setError] = useState<boolean>(false);

	const [processingReportId, setProcessingReportId] = useState<number | null>(
		null
	);

	const [rejectionModal, setRejectionModal] = useState<{
		isOpen: boolean;
		reportId: number | null;
		reportTitle: string;
	}>({
		isOpen: false,
		reportId: null,
		reportTitle: "",
	});

	// Page-level notifications for immediate feedback
	type PageNotification = { message: string; reportId: number; timestamp: string };
	const [pageNotifications, setPageNotifications] = useState<PageNotification[]>([]);
	const addNotification = (message: string, reportId: number) =>
		setPageNotifications((prev) => [
			{ message, reportId, timestamp: new Date().toISOString() },
			...prev,
		]);
	const clearPageNotification = (index: number) =>
		setPageNotifications((prev) => prev.filter((_, i) => i !== index));

	const closeRejectionModal = () => {
		setRejectionModal({ isOpen: false, reportId: null, reportTitle: "" });
	};

	useEffect(() => {
		const init = async () => {
			setLoading(true);
			setError(false);
			const response = await reportService.getPendingReports();
			if (response.success) {
				console.log("Fetched reports:", response.data);
				setReports(response.data);
			} else {
				setError(true);
				console.error("Error fetching reports:", response.data.message);
			}
			setLoading(false);
		};
		init();
	}, []);

	const openRejectionModal = (
		reportId: number | null,
		reportTitle: string
	) => {
		setRejectionModal({
			isOpen: true,
			reportId,
			reportTitle,
		});
	};

	const handleApprove = async (reportId: number) => {
		setProcessingReportId(reportId);
		try {
			const result = await reportService.approveReport(reportId);
			if (result.success) {
				setReports((reports) =>
					reports.filter((r) => r.id !== reportId)
				);
				addNotification("Report approved successfully", reportId);
			} else {
				console.error("Failed to approve report:", result.data);
				const errorMessage =
					typeof result.data === "string"
						? result.data
						: (result as any).data?.message || "Failed to approve report";
				addNotification(errorMessage, reportId);
			}
		} catch (error) {
			console.error("Error approving report:", error);
			addNotification("Network error: Unable to approve report", reportId);
		} finally {
			setProcessingReportId(null);
		}
	};

	const handleReject = async (motivation: string) => {
		const id = rejectionModal.reportId;
		if (!id) return;
		setProcessingReportId(id);
		try {
			const result = await reportService.rejectReport(id, motivation);
			if (!result.success) {
				const message =
					typeof result.data === "string"
						? result.data
						: result.data?.message || "Failed to reject report";
				addNotification(message, id);
				throw new Error(message);
			}
			setReports((reports) => reports.filter((r) => r.id !== id));
			addNotification("Report rejected successfully", id);
		} catch (error) {
			console.error("Error rejecting report:", error);
			const message =
				error instanceof Error
					? error.message
					: "Network error: Unable to reject report";
			addNotification(message, id);
			throw error;
		} finally {
			setProcessingReportId(null);
		}
	};

	const handleRejectClick = (reportId: number) => {
		const report = reports.find((r) => r.id === reportId);
		if (report) {
			openRejectionModal(reportId, report.title);
		}
	};

	if (loading) {
		return <LoadingState />;
	}

	if (error) {
		return <ErrorState error="Sometimes went wrong" />;
	}

	return (
		<ContentContainer width="xl:w-5/6 sm:w-full" gap="gap-6" padding="p-5">
			<PageTitle>Pending Reports</PageTitle>
			<SubTitle>Review and approve or reject citizen reports</SubTitle>

			<ReportList
				reports={reports}
				processingReportId={processingReportId}
				onApprove={handleApprove}
				onReject={handleRejectClick}
				allowInternalComments={false}
				allowMessages={false}
			/>

			<RejectionModal
				isOpen={rejectionModal.isOpen}
				reportTitle={rejectionModal.reportTitle}
				onClose={closeRejectionModal}
				onConfirm={handleReject}
				isProcessing={processingReportId === rejectionModal.reportId}
			/>

			{/* Page-level Notification Toast */}
			<NotificationToast
				notifications={pageNotifications}
				onClose={clearPageNotification}
			/>
		</ContentContainer>
	);
}
