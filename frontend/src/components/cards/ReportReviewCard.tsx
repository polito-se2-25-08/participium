import { useState } from "react";
import type { Report } from "../../types";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import DangerButton from "../buttons/variants/danger/DangerButton";
import ImageZoomModal from "../modals/ImageZoomModal";

interface ReportReviewCardProps {
  report: Report;
  onApprove: (reportId: number) => void;
  onReject: (reportId: number) => void;
  onSuspend?: (reportId: number) => void; // Optional third action
  isProcessing?: boolean;
  approveLabel?: string;
  rejectLabel?: string;
  suspendLabel?: string; // Optional third button label
}

export default function ReportReviewCard({
  report,
  onApprove,
  onReject,
  onSuspend,
  isProcessing = false,
  approveLabel = "Approve Report",
  rejectLabel = "Reject Report",
  suspendLabel = "Suspend Report",
}: ReportReviewCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log('Report data:', {
  anonymous: report.anonymous,
  user: report.user,
  fullReport: report
});
console.log('Full report object:', JSON.stringify(report, null, 2));
console.log('Photos:', report.photos, 'Full report:', report);

  // Handle both timestamp and createdAt field names
  const reportDate = (report as any).timestamp || (report as any).createdAt;

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {report.title}
          </h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">
              Category: <span className="font-medium">{report.category}</span>
            </p>
            <p className="text-sm text-gray-500">
              Submitted by:{" "}
              <span className="font-medium">
                {report.anonymous
                  ? "Anonymous"
                  : report.user?.name && report.user?.surname
                  ? `${report.user.name} ${report.user.surname}`
                  : (report as any).user_id || "Unknown User"}
              </span>
            </p>
            {report.location && (
              <p className="text-sm text-gray-500">
                Location:{" "}
                <span className="font-medium">
                  {report.location.latitude.toFixed(6)},{" "}
                  {report.location.longitude.toFixed(6)}
                </span>
              </p>
            )}
            <p className="text-sm text-gray-500">
              Date:{" "}
              <span className="font-medium">{formatDate(reportDate)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 min-w-[180px]">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            {report.status}
          </span>

          {report.photos && report.photos.length > 0 && (
            <div className="w-full">
              <div className="flex gap-2 flex-wrap justify-end">
                {report.photos.map((photo, index) => (
                  <img
                    key={photo.id}
                    src={photo.report_photo}
                    alt={`Report photo ${index + 1}`}
                    className="w-24 h-24 object-cover rounded border border-gray-300"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4">{report.description}</p>

      <div className={`grid ${onSuspend ? 'grid-cols-3' : 'grid-cols-2'} gap-3 mt-6 pt-4 border-t border-gray-200`}>
        <button
          onClick={() => onApprove(report.id)}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {approveLabel}
        </button>
        {onSuspend && (
          <button
            onClick={() => onSuspend(report.id)}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {suspendLabel}
          </button>
        )}
        <DangerButton
          onClick={() => onReject(report.id)}
          pending={isProcessing}
        >
          {rejectLabel}
        </DangerButton>
      </div>
    </div>
  );
}