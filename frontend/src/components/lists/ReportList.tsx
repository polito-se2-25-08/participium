import type { Report } from "../../types";
import ReportReviewCard from "../cards/ReportReviewCard";

interface ReportListProps {
  reports: Report[];
  processingReportId: number | null;
  onApprove: (reportId: number) => void;
  onReject: (reportId: number) => void;
  approveLabel?: string;
  rejectLabel?: string;
  allowInternalComments?: boolean;
  allowMessages?: boolean;
  onSendMessage?: (reportId: number, message: string) => void;
}

export default function ReportList({
  reports,
  processingReportId,
  onApprove,
  onReject,
  approveLabel,
  rejectLabel,
  allowInternalComments = true,
  allowMessages = false,
  onSendMessage,
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
          allowInternalComments={allowInternalComments}
          allowMessages={allowMessages}
          onSendMessage={onSendMessage}
        />
      ))}
    </div>
  );
}
