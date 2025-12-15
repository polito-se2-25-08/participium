import ContentContainer from "../containers/ContentContainer";
import PageTitle from "../titles/PageTitle";

interface ErrorStateProps {
	error: string;
	title?: string;
}

export default function ErrorState({
	error,
	title = "Pending Reports",
}: ErrorStateProps) {
	return (
		<ContentContainer width="xl:w-5/6 sm:w-full" gap="gap-4" padding="p-5">
			<PageTitle>{title}</PageTitle>
			<p className="text-center text-red-500">{error}</p>
		</ContentContainer>
	);
}
