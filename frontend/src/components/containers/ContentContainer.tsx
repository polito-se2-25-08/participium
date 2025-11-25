import type { ReactNode } from "react";

interface ContentContainerProps {
	children: ReactNode;
	width?: string;
	gap?: string;
	padding?: string;
	marginBottom?: string;
	marginTop?: string;
	marginLeft?: string;
	marginRight?: string;
	className?: string;
}

export default function ContentContainer({
	children,
	width = "",
	gap = "",
	padding = "",
	marginBottom = "",
	marginTop = "",
	marginLeft = "",
	marginRight = "",
	className = "",
}: ContentContainerProps) {
	const classes = [
		"flex flex-col",
		width,
		gap,
		padding,
		marginBottom,
		marginTop,
		marginLeft,
		marginRight,
		className,
	]
		.filter(Boolean)
		.join(" ");

	return <div className={classes}>{children}</div>;
}
