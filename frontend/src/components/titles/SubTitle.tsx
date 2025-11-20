import type { ReactNode } from "react";

interface SubTitleProps {
	children: ReactNode;
}
export default function SubTitle({ children }: SubTitleProps) {
	return (
		<h2 className="font-semibold text-[#2c3e50] text-[1.5rem] text-center ">
			{children}
		</h2>
	);
}
