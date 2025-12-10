import { usePendingReports } from "../../hooks/usePendingReports";
import ReportReviewCard from "../cards/ReportReviewCard";

interface ReportListProps {
	processingReportId: number | null;
	onApprove: (reportId: number) => void;
	onReject: (reportId: number) => void;
	approveLabel?: string;
	rejectLabel?: string;
}

export default function ReportList({
	processingReportId,
	onApprove,
	onReject,
	approveLabel,
	rejectLabel,
}: ReportListProps) {
	const { reports } = usePendingReports();
	if (reports.length === 0) {
		return (
			<p className="text-center text-gray-500 py-8">
				No pending reports to review
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<p className="text-sm text-gray-600">
				{reports.length} report{reports.length !== 1 ? "s" : ""} in
				queue
			</p>

			{reports.map((report) => (
				<ReportReviewCard
					key={report.id}
					report={report}
					onApprove={onApprove}
					onReject={onReject}
					isProcessing={processingReportId === report.id}
					approveLabel={approveLabel}
					rejectLabel={rejectLabel}
				/>
			))}
		</div>
	);
}
