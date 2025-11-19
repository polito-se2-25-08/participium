import { REPORT_CATEGORIES } from "../../constants";

interface SelectProps {
	id: string;
	name: string;
	value: string;
	className: string;
	hasLabel: boolean;
	label?: string;
	placeholder: string;
	showError?: boolean;
	required?: boolean;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
export default function Select({
	id,
	name,
	value,
	className,
	onChange,
	hasLabel,
	label = "",
	placeholder,
	showError = false,
	required = false,
}: SelectProps) {
	return (
		<div className="flex flex-col">
			{hasLabel && (
				<label className="text-gray-700 font-bold">{label}</label>
			)}
			<select
				id="category"
				name={name}
				onChange={onChange}
				value={value}
				className={`border ${
					showError && "border-red-500"
				} rounded w-full py-2 px-3 text-gray-700 leading-tight`}
				required={required}
			>
				<option value="">{placeholder}</option>
				{REPORT_CATEGORIES.map((cat) => (
					<option key={cat.value} value={cat.value}>
						{cat.label}
					</option>
				))}
			</select>
		</div>
	);
}
