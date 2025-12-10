import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import type { Report } from "../types";
import { reportService } from "../api/reportService";

interface PendingReportsContextType {
	reports: Report[];
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	addNewMessage: (
		reportId: number,
		message: {
			id: number;
			message: string;
			created_at: string;
			report_id: number;
			sender_id: number;
		}
	) => void;
}

const PendingReportsContext = createContext<
	PendingReportsContextType | undefined
>(undefined);

interface PendingReportsProviderProps {
	children: ReactNode;
}

export function PendingReportsProvider({
	children,
}: PendingReportsProviderProps) {
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchPendingReports();
	}, []);

	const fetchPendingReports = async () => {
		try {
			setLoading(true);
			const result = await reportService.getAllReports();

			if (result && typeof result === "object") {
				if ("success" in result && result.success && result.data) {
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
			} else {
				setError("Invalid response format");
			}
		} catch (err) {
			setError("Failed to load pending reports");
		} finally {
			setLoading(false);
		}
	};

	const filterPendingReports = (allReports: Report[]): Report[] => {
		return allReports.filter(
			(report) =>
				report.status === "PENDING_APPROVAL" || report.status === null
		);
	};

	const addNewMessage = (
		reportId: number,
		message: {
			id: number;
			message: string;
			created_at: string;
			report_id: number;
			sender_id: number;
		}
	) => {
		setReports((prevReports) =>
			prevReports.map((report) =>
				report.id === reportId
					? { ...report, messages: [...report.messages, message] }
					: report
			)
		);
	};

	return (
		<PendingReportsContext.Provider
			value={{
				reports,
				loading,
				error,
				refetch: fetchPendingReports,
				addNewMessage,
			}}
		>
			{children}
		</PendingReportsContext.Provider>
	);
}

// Hook di comodo per usare il context
export function usePendingReports() {
	const context = useContext(PendingReportsContext);
	if (!context) {
		throw new Error(
			"usePendingReports must be used within a PendingReportsProvider"
		);
	}
	return context;
}
