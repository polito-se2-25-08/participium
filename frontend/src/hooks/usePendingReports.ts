import { useState, useEffect } from "react";

import { reportService } from "../api/reportService";
import type { ReportDTO } from "../interfaces/dto/report/ReportDTO";

export function usePendingReports() {
	const [reports, setReports] = useState<ReportDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPendingReports = async () => {
			try {
				setLoading(true);
				const result = await reportService.getAllReports();
				console.log(result);
				if (result.success) {
					const pendingReports = filterPendingReports(result.data);
					setReports(pendingReports);
				} else if (Array.isArray(result)) {
					const pendingReports = filterPendingReports(result);
					setReports(pendingReports);
				} else {
					setError(
						(result as any).data?.message ||
							(result as any).message ||
							"Failed to load pending reports"
					);
				}
			} catch (err) {
				setError("Failed to load pending reports");
			} finally {
				setLoading(false);
			}
		};

		fetchPendingReports();
	}, []);

	const fetchPendingReports = async () => {};

	const filterPendingReports = (allReports: ReportDTO[]): ReportDTO[] => {
		return allReports.filter(
			(report) =>
				report.status === "PENDING_APPROVAL" || report.status === null
		);
	};

	const addNewMessage = (reportId: number, message: any) => {
		setReports((prevReports) =>
			prevReports.map((report) => {
				if (report.id === reportId) {
					return {
						...report,
						messages: [...(report.messages || []), message],
					};
				}
				return report;
			})
		);
	};

	return {
		reports,
		loading,
		error,
		refetch: fetchPendingReports,
		addNewMessage,
	};
}
