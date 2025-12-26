import type { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}
export default function PageTitle({ children, className = "" }: PageTitleProps) {
  return (
    <h1
      className={[
        "font-semibold text-[#2c3e50] text-[3rem] text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </h1>
  );
}
