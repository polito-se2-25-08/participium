import Input from "../Input";

interface CheckInputProps {
  id: string;
  name: string;
  checked?: boolean;
  label?: string;
  hasLabel?: boolean;
  showError?: boolean;
  required?: boolean;
  disabled?: boolean;
  pending?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckInput({
  id,
  name,
  checked,
  label,
  hasLabel = false,
  showError = false,
  required = false,
  disabled = false,
  pending = false,
  onChange,
}: CheckInputProps) {
  return (
    <Input
      id={id}
      name={name}
      type="checkbox"
      label={label}
      hasLabel={hasLabel}
      checked={checked}
      showError={showError}
      required={required}
      disabled={disabled}
      pending={pending}
      onChange={onChange}
    />
  );
}
