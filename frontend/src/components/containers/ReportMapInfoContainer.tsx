import type { ReactNode } from "react";

interface ReportMapInfoContainerProps {
  children: ReactNode;
}
export default function ReportMapInfoContainer({
  children,
}: ReportMapInfoContainerProps) {
  return (
    <div className="flex flex-col w-1/3 h-1/2 rounded-xl shadow-xl border border-gray-600 gap-3">
      {children}
    </div>
  );
}
