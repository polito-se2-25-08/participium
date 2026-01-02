import SubTitle from "../../titles/SubTitle";
import type { ClientReportMapI } from "../../../interfaces/dto/report/NewReportResponse";
import { formatTimestamp } from "../../../utilis/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCirclePause,
	faPersonDigging,
	faUserCheck,
	faClock,
} from "@fortawesome/free-solid-svg-icons";

interface ActiveReportsListProps {
	reports: ClientReportMapI[];
	onReportClick: (reportId: number) => void;
}

const getStatusBadge = (status: string | null) => {
	switch (status) {
		case "ASSIGNED":
			return {
				label: "Assigned",
				icon: faUserCheck,
				className: "bg-blue-100 text-blue-800 border-blue-200",
			};
		case "IN_PROGRESS":
			return {
				label: "In Progress",
				icon: faPersonDigging,
				className: "bg-indigo-100 text-indigo-800 border-indigo-200",
			};
		case "SUSPENDED":
			return {
				label: "Suspended",
				icon: faCirclePause,
				className: "bg-gray-100 text-gray-800 border-gray-200",
			};
		default:
			return {
				label: status ?? "Unknown",
				icon: faClock,
				className: "bg-gray-100 text-gray-800 border-gray-200",
			};
	}
};

export default function ActiveReportsList({ reports, onReportClick }: ActiveReportsListProps) {
	return (
		<div className="flex flex-col rounded-xl shadow-xl border border-gray-600 w-full h-full overflow-hidden">
			<div className="flex flex-col gap-1 px-6 py-4 border-b border-gray-200 bg-gray-50">
				<div className="flex flex-row items-center justify-between gap-3">
					<SubTitle fontSize="text-[1.6rem]" textStart>
						Active Reports
					</SubTitle>
					<span className="text-base opacity-70">
						{reports.length}
					</span>
				</div>
				<span className="text-base opacity-70">
					Click a report to view details
				</span>
			</div>

			<div className="overflow-y-auto flex-1 min-h-0 flex flex-col px-6 py-5">
				{reports.length === 0 ? (
					<div className="flex flex-col h-full w-full justify-center items-center opacity-60">
						<span>No active reports found</span>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{reports.map((report) => {
							const statusBadge = getStatusBadge(report.status);
							const reportDate = report.timestamp ? formatTimestamp(report.timestamp) : "";
							return (
								<div
									key={report.id}
									className="flex flex-col border border-gray-200 bg-white shadow hover:shadow-md rounded-2xl"
								>
									<button
										onClick={() => onReportClick(report.id)}
										className="flex flex-row items-center gap-4 hover:cursor-pointer w-full px-5 py-4"
									>
										<div className="flex flex-row justify-between items-start w-full gap-3">
											<div className="flex flex-col min-w-0 flex-1">
												<SubTitle
													textStart
													fontSize="text-[1.25rem]"
													className="!truncate"
												>
													{report.title}
												</SubTitle>
												<span className="text-sm opacity-60 text-start flex flex-row items-center gap-2">
													<FontAwesomeIcon icon={faClock} />
													{reportDate}
												</span>
											</div>

											<span
												className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full border ${statusBadge.className}`}
											>
												<FontAwesomeIcon icon={statusBadge.icon} />
												{statusBadge.label}
											</span>
										</div>
									</button>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
