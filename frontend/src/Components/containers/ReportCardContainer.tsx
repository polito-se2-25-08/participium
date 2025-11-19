import type { ReactNode } from "react";

interface ReportCardContainerProps {
	children: ReactNode;
}
export default function ReportCardContainer({
	children,
}: ReportCardContainerProps) {
	return (
		<div className="flex flex-col rounded-xl shadow-xl border border-gray-600 p-4 gap-3">
			{children}
		</div>
	);
}
