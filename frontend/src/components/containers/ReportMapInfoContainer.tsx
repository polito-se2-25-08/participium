import type { ReactNode } from "react";

interface ReportMapInfoContainerProps {
  children: ReactNode;
}
export default function ReportMapInfoContainer({
  children,
}: ReportMapInfoContainerProps) {
  return (
    <div className="flex flex-col w-full h-[55%] rounded-xl shadow-xl border border-gray-600 gap-4">
      {children}
    </div>
  );
}
