import type { ReactNode } from "react";
import Button from "../../Button";

interface PrimaryButtonProps {
	children: ReactNode;
	onClick?: () => void;
	type?: "submit" | "button";
	className?: string;
	pending?: boolean;
	disabled?: boolean;
}

export default function PrimaryButton({
	children,
	className,
	type = "button",
	pending = false,
	disabled = false,
	onClick,
}: PrimaryButtonProps) {
	return (
		<Button
			className={className}
			type={type}
			variant="PRIMARY"
			onClick={onClick}
			pending={pending}
			disabled={disabled}
		>
			{children}
		</Button>
	);
}
