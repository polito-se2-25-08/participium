import type { Report } from "../../types";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import DangerButton from "../buttons/variants/danger/DangerButton";

interface ReportReviewCardProps {
  report: Report;
  onApprove: (reportId: number) => void;
  onReject: (reportId: number) => void;
  isProcessing?: boolean;
}

export default function ReportReviewCard({
  report,
  onApprove,
  onReject,
  isProcessing = false,
}: ReportReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle both timestamp and createdAt field names
  const reportDate = (report as any).timestamp || (report as any).createdAt;

  return (
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
                  {report.anonymous ? "Anonymous" : report.user ? `${report.user.name} ${report.user.surname}` : "Unknown User"}
                </span>
              </p>
              {report.location && (
                <p className="text-sm text-gray-500">
                  Location:{" "}
                  <span className="font-medium">
                    {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                  </span>
                </p>
              )}
              <p className="text-sm text-gray-500">
                Date: <span className="font-medium">{formatDate(reportDate)}</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3 min-w-[180px]">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              Pending
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

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <PrimaryButton
            onClick={() => onApprove(report.id)}
            pending={isProcessing}
          >
            Approve Report
          </PrimaryButton>
          <DangerButton
            onClick={() => onReject(report.id)}
            pending={isProcessing}
          >
            Reject Report
          </DangerButton>
        </div>
      </div>
  );
}
