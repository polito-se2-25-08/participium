import type { ReactNode } from "react";

interface FormProps {
	children: ReactNode;
	className?: string;
	formAction?: (formData: FormData) => void | Promise<void>;
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}
export default function Form({
	children,
	className,
	formAction,
	onSubmit,
}: FormProps) {
	return (
		<form
			noValidate
			action={formAction}
			onSubmit={onSubmit}
			className={`flex flex-col  ${className}`}
		>
			{children}
		</form>
	);
}
