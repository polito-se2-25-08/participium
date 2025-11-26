import { useState } from "react";
import ContentContainer from "../containers/ContentContainer";
import PageTitle from "../titles/PageTitle";
import SubTitle from "../titles/SubTitle";
import LoadingState from "../states/LoadingState";
import ErrorState from "../states/ErrorState";
import ReportReviewCard from "../cards/ReportReviewCard";
import { useCategoryReports } from "../../hooks/useCategoryReports";
import { reportService } from "../../api/reportService";

export default function CategoryReportsPage() {
  const { reports, loading, error, refetch } = useCategoryReports();
  const [processingReportId, setProcessingReportId] = useState<number | null>(null);

  // Handler to start a report (ASSIGNED -> IN_PROGRESS)
  const handleStart = async (reportId: number) => {
    try {
      setProcessingReportId(reportId);

      const result = await reportService.updateReportStatus(reportId, "IN_PROGRESS");

      if (result.success) {
        console.log(`Report ${reportId} started`);
        refetch();
      } else {
        console.error("Failed to start report:", result.data);
      }
    } catch (err) {
      console.error("Error starting report:", err);
    } finally {
      setProcessingReportId(null);
    }
  };

  // Handler to suspend a report
  const handleSuspend = async (reportId: number) => {
    try {
      setProcessingReportId(reportId);

      const result = await reportService.updateReportStatus(reportId, "SUSPENDED");

      if (result.success) {
        console.log(`Report ${reportId} suspended`);
        refetch();
      } else {
        console.error("Failed to suspend report:", result.data);
      }
    } catch (err) {
      console.error("Error suspending report:", err);
    } finally {
      setProcessingReportId(null);
    }
  };

  // Handler to toggle between IN_PROGRESS and SUSPENDED
  const handleToggleStatus = async (reportId: number) => {
    try {
      setProcessingReportId(reportId);

      const currentReport = reports.find((r) => r.id === reportId);
      const currentStatus = currentReport?.status;

      const newStatus =
        currentStatus === "IN_PROGRESS" ? "SUSPENDED" : "IN_PROGRESS";

      const result = await reportService.updateReportStatus(reportId, newStatus);

      if (result.success) {
        console.log(`Report ${reportId} updated to ${newStatus}`);
        refetch();
      } else {
        console.error("Failed to update report:", result.data);
      }
    } catch (err) {
      console.error("Error toggling report status:", err);
    } finally {
      setProcessingReportId(null);
    }
  };

  // Handler to resolve report
  const handleResolve = async (reportId: number) => {
    try {
      setProcessingReportId(reportId);

      const result = await reportService.updateReportStatus(reportId, "RESOLVED");

      if (result.success) {
        console.log(`Report ${reportId} resolved`);
        refetch();
      } else {
        console.error("Failed to resolve report:", result.data);
      }
    } catch (err) {
      console.error("Error resolving report:", err);
    } finally {
      setProcessingReportId(null);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (reports.length === 0) {
    return (
      <ContentContainer width="xl:w-5/6 sm:w-full" gap="gap-6" padding="p-5">
        <PageTitle>Category Reports</PageTitle>
        <SubTitle>Overview of reports assigned to your category</SubTitle>
        <p className="text-center text-gray-500 py-8">
          No pending reports to review
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
          {reports.length} report{reports.length !== 1 ? "s" : ""} in queue
        </p>

        {reports.map((report) => {
          // For ASSIGNED status, show Start/Suspend/Resolve buttons
          if (report.status === "ASSIGNED") {
            return (
              <ReportReviewCard
                key={report.id}
                report={report}
                onApprove={handleStart}
                onReject={handleResolve}
                onSuspend={handleSuspend}
                isProcessing={processingReportId === report.id}
                approveLabel="Start Report"
                rejectLabel="Resolve Report"
                suspendLabel="Suspend Report"
              />
            );
          }

          // For other statuses, show toggle and resolve
          return (
            <ReportReviewCard
              key={report.id}
              report={report}
              onApprove={handleToggleStatus}
              onReject={handleResolve}
              isProcessing={processingReportId === report.id}
              approveLabel={report.status === "SUSPENDED" ? "Resume Report" : "Suspend Report"}
              rejectLabel="Resolve Report"
            />
          );
        })}
      </div>
    </ContentContainer>
  );
}