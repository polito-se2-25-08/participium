interface BaseInputProps {
	id: string;
	name: string;
	type: string;
	value?: string;
	checked?: boolean;
	label?: string;
	hasLabel?: boolean;
	placeholder?: string;
	accept?: string;
	showError?: boolean;
	required?: boolean;
	disabled?: boolean;
	pending?: boolean;
	multiple?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
	id,
	name,
	type,
	value,
	checked,
	label = "",
	hasLabel = false,
	placeholder = "",
	accept = "",
	showError = false,
	required = false,
	disabled = false,
	pending = false,
	multiple = false,
	onChange,
}: BaseInputProps) {
	const isDisabled = pending || disabled;
	const errorMessage =
		type === "email" ? "A valid email is required" : `${label} is required`;
	const wrapperClass = `w-full ${pending ? "opacity-50" : ""}`;
	const baseInputClass = `border border-gray-800 ${
		showError ? "border-red-500" : "border-gray-300"
	} rounded w-full py-2 px-3 text-gray-700 leading-tight`;

	if (type === "checkbox") {
		return (
			<div
				className={`flex items-center gap-2 ${
					pending ? "opacity-50" : ""
				}`}
			>
				<input
					id={id}
					name={name}
					type="checkbox"
					checked={checked}
					disabled={isDisabled}
					onChange={onChange}
					className="w-5 h-5"
				/>
				{hasLabel && (
					<label htmlFor={id} className="text-gray-700">
						{label}
					</label>
				)}
				{showError && (
					<span className="text-red-500 text-sm">{errorMessage}</span>
				)}
			</div>
		);
	}

	if (type === "file") {
		return (
			<div className={wrapperClass}>
				{hasLabel && (
					<label className="text-gray-700 font-bold">{label}</label>
				)}
				<input
					id={id}
					name={name}
					type="file"
					accept={accept}
					required={required}
					autoComplete="off"
					disabled={isDisabled}
					className={baseInputClass}
					multiple={multiple}
					onChange={onChange}
				/>
				{showError && (
					<span className="text-red-500 text-sm">{errorMessage}</span>
				)}
			</div>
		);
	}

	const controlledProps = onChange ? { value: value ?? "", onChange } : {};

	return (
		<div className={wrapperClass}>
			{hasLabel && (
				<label className="text-gray-700 font-bold">{label}</label>
			)}
			<input
				id={id}
				name={name}
				type={type}
				required={required}
				placeholder={placeholder}
				autoComplete="off"
				disabled={isDisabled}
				{...controlledProps}
				className={baseInputClass}
			/>
			{showError && (
				<span className="text-red-500 text-sm">{errorMessage}</span>
			)}
		</div>
	);
}
