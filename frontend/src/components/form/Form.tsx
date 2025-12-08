import type { ReactNode } from "react";

interface FormProps {
	children: ReactNode;
	className?: string;
	formAction?: (formData: FormData) => void | Promise<void>;
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;

	padding?: string;
	gap?: string;
	marginBottom?: string;
	marginTop?: string;
	marginLeft?: string;
	marginRight?: string;
	width?: string;
	height?: string;
}

export default function Form({
	children,
	className = "",
	formAction,
	onSubmit,
	padding = "",
	gap = "",
	marginBottom = "",
	marginTop = "",
	marginLeft = "",
	marginRight = "",
	width = "w-full",
	height = "",
}: FormProps) {
	const classes = [
		"flex flex-col",
		className,
		padding,
		gap,
		marginBottom,
		marginTop,
		marginLeft,
		marginRight,
		width,
		height,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<form
			noValidate
			action={formAction}
			onSubmit={onSubmit}
			className={classes}
		>
			{children}
		</form>
	);
}
