import type { ReactNode } from "react";

interface ContentContainerProps {
	children: ReactNode;
}
export default function ContentContainer({ children }: ContentContainerProps) {
	return (
		<div className="flex items-center justify-center w-full flex-1">
			{children}
		</div>
	);
}
