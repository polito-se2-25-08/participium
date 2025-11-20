import type { ReactNode } from "react";
import Button from "../../Button";

interface PrimaryButtonProps {
	children: ReactNode;
	className?: string;
	type?: "submit" | "button";
	onClick?: () => void;
	pending?: boolean;
}

export default function DangerButton({
	children,
	className,
	onClick,
	type = "button",
	pending = false,
}: PrimaryButtonProps) {
	return (
		<Button
			className={className}
			type={type}
			onClick={onClick}
			variant="DANGER"
			pending={pending}
		>
			{children}
		</Button>
	);
}
