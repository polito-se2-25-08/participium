import ContentContainer from "../containers/ContentContainer";
import PageTitle from "../titles/PageTitle";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading reports..." }: LoadingStateProps) {
  return (
    <ContentContainer
      width="xl:w-5/6 sm:w-full"
      gap="gap-4"
      padding="p-5"
    >
      <PageTitle>Pending Reports</PageTitle>
      <p className="text-center text-gray-500">{message}</p>
    </ContentContainer>
  );
}
