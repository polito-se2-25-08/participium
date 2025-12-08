import type { ReactNode } from "react";

interface SubTitleProps {
	children: ReactNode;
	className?: string;
	fontSize?: string;
	textStart?: boolean;
}

export default function SubTitle({
	children,
	className = "",
	fontSize = "text-[1.5rem]",
	textStart = false,
}: SubTitleProps) {
	return (
		<h2
			className={`font-semibold text-[#2c3e50] ${fontSize} ${
				textStart ? "text-start" : "text-center"
			}   truncate ${className}`}
		>
			{children}
		</h2>
	);
}
