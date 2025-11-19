interface inputProps {
	placeholder: string;
	id: string;
	type: "text" | "password" | "email";
	hasLabel: boolean;
	name: string;
	label?: string;
	required?: boolean;
	showError?: boolean;
	pending?: boolean;
	disabled?: boolean;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function Input({
	placeholder,
	id,
	type,
	hasLabel,
	label = "",
	name,
	required = false,
	showError = false,
	pending = false,
	disabled = false,
	value,
}: inputProps) {
	return (
		<div className={`${pending && "opacity-50 "}`}>
			{hasLabel && (
				<label className="text-gray-700 font-bold">{label}</label>
			)}

			<input
				required={required}
				className={`border ${
					showError && "border-red-500"
				} rounded w-full py-2 px-3 text-gray-700 leading-tight`}
				id={id}
				type={type}
				placeholder={placeholder}
				name={name}
				autoComplete="off"
				disabled={pending || disabled}
				{...(value !== undefined ? { value } : {})}
			/>

			{showError && (
				<span className="text-red-500 text-sm">
					{type === "email"
						? "A valid email is required"
						: `${label} is required`}
				</span>
			)}
		</div>
	);
}
