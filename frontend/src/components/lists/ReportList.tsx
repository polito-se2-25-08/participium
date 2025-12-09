import type { Report } from "../../types";
import ReportReviewCard from "../cards/ReportReviewCard";

interface ReportListProps {
  reports: Report[];
  processingReportId: number | null;
  onApprove: (reportId: number) => void;
  onReject: (reportId: number) => void;
  approveLabel?: string;
  rejectLabel?: string;
  allowComments?: boolean;
}

export default function ReportList({
  reports,
  processingReportId,
  onApprove,
  onReject,
  approveLabel,
  rejectLabel,
  allowComments = true,
}: ReportListProps) {
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
        {reports.length} report{reports.length !== 1 ? "s" : ""} in queue
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
          allowComments={allowComments}
        />
      ))}
    </div>
  );
}
