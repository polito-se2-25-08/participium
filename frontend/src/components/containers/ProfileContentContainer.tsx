import type { ReactNode } from "react";

interface ProfileContentContainerProps {
	children: ReactNode;
}
export default function ProfileContentContainer({
	children,
}: ProfileContentContainerProps) {
	return (
		<div className="flex flex-row rounded-xl shadow-xl border border-gray-600 p-8 gap-3">
			{children}
		</div>
	);
}
