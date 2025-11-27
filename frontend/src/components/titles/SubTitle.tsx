import type { ReactNode } from "react";

interface SubTitleProps {
	children: ReactNode;
	className?: string;
	fontSize?: string;
}
export default function SubTitle({
	children,
	className,
	fontSize,
}: SubTitleProps) {
	if (!fontSize) {
		fontSize = "text-[1.5rem]";
	}

	return (
		<h2
			className={`font-semibold text-[#2c3e50] ${fontSize} text-center ${className}`}
		>
			{children}
		</h2>
	);
}
