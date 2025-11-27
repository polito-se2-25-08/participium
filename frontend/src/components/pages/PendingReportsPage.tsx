import ContentContainer from "../containers/ContentContainer";
import PageTitle from "../titles/PageTitle";
import SubTitle from "../titles/SubTitle";
import RejectionModal from "../modals/RejectionModal";
import LoadingState from "../states/LoadingState";
import ErrorState from "../states/ErrorState";
import ReportList from "../lists/ReportList";
import { usePendingReports } from "../../hooks/usePendingReports";
import { useReportActions } from "../../hooks/useReportActions";

export default function PendingReportsPage() {
  const { reports, loading, error, refetch } = usePendingReports();
  const {
    processingReportId,
    rejectionModal,
    handleApprove,
    openRejectionModal,
    closeRejectionModal,
    handleReject,
  } = useReportActions(refetch);

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
    return <ErrorState error={error} />;
  }

  return (
    <ContentContainer
      width="xl:w-5/6 sm:w-full"
      gap="gap-6"
      padding="p-5"
    >
      <PageTitle>Pending Reports</PageTitle>
      <SubTitle>Review and approve or reject citizen reports</SubTitle>

      <ReportList
        reports={reports}
        processingReportId={processingReportId}
        onApprove={handleApprove}
        onReject={handleRejectClick}
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
