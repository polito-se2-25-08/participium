import type { ReactNode } from "react";
import LoadingDots from "../loaders/LoadingDots";

interface ButtonProps {
	children: ReactNode;
	className?: string;
	variant: "PRIMARY" | "DANGER" | "OUTLINE_PRIMARY";
	type: "submit" | "button" | "reset" | undefined;
	pending: boolean;
	onClick?: () => void;
	disabled: boolean;
}
export default function Button({
	children,
	variant,
	type,
	className,
	pending,
	disabled,
	onClick,
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`px-4 py-2 rounded w-full 
    ${pending || disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
    ${className} 
    ${
		variant === "PRIMARY"
			? pending || disabled
				? "bg-blue-500 text-white"
				: "bg-blue-500 hover:bg-blue-600 text-white"
			: variant === "DANGER"
			? pending || disabled
				? "bg-red-500 text-white"
				: "bg-red-500 hover:bg-red-600 text-white"
			: variant === "OUTLINE_PRIMARY"
			? pending || disabled
				? "bg-transparent text-blue-500 border border-blue-500"
				: "bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
			: ""
	}
  `}
			disabled={pending || disabled}
		>
			{pending ? <LoadingDots /> : children}
		</button>
	);
}
