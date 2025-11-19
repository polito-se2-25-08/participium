import type { ReactNode } from "react";
import LoadingDots from "../loaders/LoadingDots";

interface ButtonProps {
	children: ReactNode;
	className?: string;
	variant: "PRIMARY" | "DANGER" | "OUTLINE_PRIMARY";
	type: "submit" | "button" | "reset" | undefined;
	pending: boolean;
	onClick?: () => void;
}
export default function Button({
	children,
	variant,
	type,
	className,
	pending,
	onClick,
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`px-4 py-2 rounded ${
				pending ? "cursor-not-allowed" : "cursor-pointer"
			} ${className} ${
				(variant === "PRIMARY" && "bg-blue-500 text-white") ||
				(variant === "DANGER" && "bg-red-500 text-white") ||
				(variant === "OUTLINE_PRIMARY" &&
					"bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white")
			}`}
			disabled={pending}
		>
			{pending ? <LoadingDots /> : children}
		</button>
	);
}
