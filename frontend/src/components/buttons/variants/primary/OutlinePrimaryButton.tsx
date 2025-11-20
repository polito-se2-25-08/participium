import type { ReactNode } from "react";
import Button from "../../Button";

interface PrimaryButtonProps {
	children: ReactNode;
	type?: "submit" | "button";
	className?: string;
	pending?: boolean;
	onClick?: () => void;
}
export default function OutlinePrimaryButton({
	children,
	type = "button",
	className,
	pending = false,
	onClick,
}: PrimaryButtonProps) {
	return (
		<Button
			className={className}
			type={type}
			variant="OUTLINE_PRIMARY"
			onClick={onClick}
			pending={pending}
		>
			{children}
		</Button>
	);
}
