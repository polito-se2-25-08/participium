import Input from "../Input";

interface TextInputProps {
  id: string;
  name: string;
  value?: string;
  label?: string;
  hasLabel?: boolean;
  placeholder?: string;
  showError?: boolean;
  required?: boolean;
  disabled?: boolean;
  pending?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  id,
  name,
  value,
  label = "Text",
  hasLabel = true,
  placeholder = "Enter text",
  showError = false,
  required = true,
  disabled = false,
  pending = false,
  onChange,
}: TextInputProps) {
  return (
    <Input
      id={id}
      name={name}
      type="text"
      value={value}
      label={label}
      hasLabel={hasLabel}
      placeholder={placeholder}
      showError={showError}
      required={required}
      disabled={disabled}
      pending={pending}
      onChange={onChange}
    />
  );
}
