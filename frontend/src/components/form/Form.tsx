import type { ReactNode } from "react";

interface FormProps {
  children: ReactNode;
  className?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;

  padding?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 0;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 0;
  marginBottom?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 0;
  marginTop?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 0;
  marginLeft?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 0;
  marginRight?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 0;
}
export default function Form({
  children,
  className,
  formAction,
  onSubmit,
  marginBottom = 0,
  marginTop = 0,
  marginLeft = 0,
  marginRight = 0,
  padding = 0,
  gap = 0,
}: FormProps) {
  return (
    <form
      noValidate
      action={formAction}
      onSubmit={onSubmit}
      className={`flex flex-col  
		${className}
		${padding > 0 ? `p-${padding}` : ""}
		${gap > 0 ? `gap-${gap}` : ""}
		${marginBottom > 0 ? `mb-${marginBottom}` : ""}
		${marginTop > 0 ? `mt-${marginTop}` : ""}
		${marginLeft > 0 ? `ml-${marginLeft}` : ""}
		${marginRight > 0 ? `mr-${marginRight}` : ""}
		`}
    >
      {children}
    </form>
  );
}
