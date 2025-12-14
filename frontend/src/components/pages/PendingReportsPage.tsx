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

export default function PendingReportsPage() {
	const [loading, setLoading] = useState(true);
	const [reports, setReports] = useState<ReportDTO[]>([]);
	const [error, setError] = useState<boolean>(false);

	const [processingReportId, setProcessingReportId] = useState<number | null>(
		null
	);

	const [rejectionModal, setRejectionModal] = useState({
		isOpen: false,
		reportId: null,
		reportTitle: "",
	});

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
				setProcessingReportId(null);
			} else {
				console.error("Failed to approve report:", result.data);
				const errorMessage =
					typeof result.data === "string"
						? result.data
						: "Failed to approve report";
				alert(errorMessage);
			}
		} catch (error) {
			console.error("Error approving report:", error);
			alert("Network error: Unable to approve report");
		} finally {
			setProcessingReportId(null);
		}
	};

	const handleReject = async (motivation: string) => {
		if (rejectionModal.reportId) {
			try {
				const result = await reportService.rejectReport(
					rejectionModal.reportId,
					motivation
				);
				if (result.success) {
				}
			} catch (error) {
				console.error("Error rejecting report:", error);
				alert("Network error: Unable to reject report");
			}
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
		</ContentContainer>
	);
}
