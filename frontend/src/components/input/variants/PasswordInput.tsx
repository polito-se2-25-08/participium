import Input from "../Input";

interface InputPasswordProps {
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

export default function PasswordInput({
  id,
  name,
  value,
  label,
  hasLabel,
  placeholder,
  showError,
  required,
  disabled,
  pending,
  onChange,
}: InputPasswordProps) {
  return (
    <Input
      id={id}
      name={name}
      type="password"
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
