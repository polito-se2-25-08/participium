import ContentContainer from "../containers/ContentContainer";
import PageTitle from "../titles/PageTitle";
import SubTitle from "../titles/SubTitle";
import LoadingState from "../states/LoadingState";
import ErrorState from "../states/ErrorState";
import ReportList from "../lists/ReportList";
import { useCategoryReports } from "../../hooks/useCategoryReports";

export default function CategoryReportsPage() {
  // 1. Use the hook to fetch data
  const { reports, loading, error, refetch } = useCategoryReports();

  // 2. Placeholder handlers
  // We will customize the buttons (e.g., "Resolve") in the next step
  const handleResolve = (reportId: number) => {
    console.log("Resolve clicked for:", reportId);
  };

  const handleReject = (reportId: number) => {
    console.log("Reject clicked for:", reportId);
  };

  // 3. Handle loading state
  if (loading) {
    return <LoadingState />;
  }

  // 4. Handle error state
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <ContentContainer width="xl:w-5/6 sm:w-full" gap="gap-6" padding="p-5">
      <PageTitle>Category Reports</PageTitle>
      <SubTitle>Overview of reports assigned to your category</SubTitle>

      {/* 5. Render the list */}
      <ReportList
        reports={reports}
        processingReportId={null}
        onApprove={handleResolve}
        onReject={handleReject}
        approveLabel="TOGGLE IN_PROGRESS / SUSPENDED"
        rejectLabel="RESOLVE REPORT"
      />
    </ContentContainer>
  );
}
