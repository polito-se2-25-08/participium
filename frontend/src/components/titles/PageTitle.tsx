import type { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}
export default function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="font-semibold text-[#2c3e50] text-[3rem] text-center ">
      {children}
    </h1>
  );
}
