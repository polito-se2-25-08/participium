interface TextAreaProps {
	value: string;
	className?: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	hasLabel?: boolean;
	label?: string;
	required?: boolean;
	showError?: boolean;
	placeholder: string;
}

export default function TextArea({
	value,
	onChange,
	showError = false,
	required = false,
	placeholder,
	className = "",
	hasLabel = false,
	label = "",
}: TextAreaProps) {
	return (
		<div className="flex flex-col">
			{hasLabel && (
				<label className="text-gray-700 font-bold">{label}</label>
			)}
			<textarea
				id="description"
				name="description"
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				rows={6}
				maxLength={2000}
				className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight ${className}`}
			/>
			<div className="char-counter">{value.length}/2000 characters</div>
		</div>
	);
}
