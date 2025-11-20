import Input from "../Input";

interface FileInputProps {
  id: string;
  name: string;
  label?: string;
  hasLabel?: boolean;
  placeholder?: string;
  showError?: boolean;
  required?: boolean;
  disabled?: boolean;
  pending?: boolean;
  multiple?: boolean;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileInput({
  id,
  name,
  label,
  hasLabel = true,
  placeholder = "",
  showError = false,
  required = true,
  disabled = false,
  pending = false,
  multiple = false,
  accept,
  onChange,
}: FileInputProps) {
  return (
    <Input
      id={id}
      name={name}
      type="file"
      label={label}
      hasLabel={hasLabel}
      placeholder={placeholder}
      showError={showError}
      required={required}
      disabled={disabled}
      pending={pending}
      multiple={multiple}
      accept={accept}
      onChange={onChange}
    />
  );
}
