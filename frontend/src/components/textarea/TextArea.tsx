import { useState } from "react";

interface TextAreaProps {
  id: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  hasLabel?: boolean;
  label?: string;
  required?: boolean;
  showError?: boolean;
  placeholder: string;
  name: string;
  value?: string;
  disabled?: boolean;
  pending?: boolean;
}

export default function TextArea({
  id,
  onChange,
  showError = false,
  required = false,
  placeholder,
  className = "",
  hasLabel = false,
  label = "",
  name,
  disabled = false,
  pending = false,
  value: controlledValue,
}: TextAreaProps) {
  const [value, setValue] = useState<string>(controlledValue ?? "");

  const isDisabled = disabled || pending;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`flex flex-col ${pending ? "opacity-50" : ""}`}>
      {hasLabel && <label className="text-gray-700 font-bold">{label}</label>}

      <textarea
        id={id}
        name={name}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        rows={6}
        maxLength={2000}
        disabled={isDisabled}
        value={controlledValue ?? value}
        className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight ${className} ${
          showError ? "border-red-500" : ""
        }`}
      />

      <div className="char-counter">
        {(controlledValue ?? value).length}/2000 characters
      </div>

      {showError && (
        <span className="text-red-500 text-sm">{label} is required</span>
      )}
    </div>
  );
}
