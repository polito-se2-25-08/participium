interface SelectProps {
  id: string;
  name: string;
  className: string;
  hasLabel: boolean;
  label?: string;
  placeholder: string;
  showError?: boolean;
  required?: boolean;
  options?: { value: string; label: string }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}
export default function Select({
  id,
  name,
  className,
  onChange,
  value,
  hasLabel,
  label = "",
  placeholder,
  showError = false,
  required = false,
  options = [{ value: "", label: "" }],
}: SelectProps) {
  const controlledProps = onChange ? { value: value ?? "", onChange } : {};
  return (
    <div className="flex flex-col">
      {hasLabel && <label className="text-gray-700 font-bold">{label}</label>}
      <select
        id="category"
        name={name}
        {...controlledProps}
        className={`border ${
          showError && "border-red-500"
        } rounded w-full py-2 px-3 text-gray-700 leading-tight`}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showError && (
        <span className="text-red-500 text-sm">{label} is required</span>
      )}
    </div>
  );
}
