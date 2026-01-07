import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../components/providers/AuthContext";
import type { ReportDTO } from "../interfaces/dto/report/ReportDTO";
import { reportService } from "../api/reportService";
interface UseCategoryReportsReturn {
  reports: ReportDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  addNewMessage: (reportId: number, message: any) => void;
}

export function useCategoryReports(): UseCategoryReportsReturn {
  const [reports, setReports] = useState<ReportDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchReports = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch reports filtered by the logged-in technician's category
      const result = await reportService.getTechnicianReports();
      let data: ReportDTO[] = [];
      if (Array.isArray(result)) {
        data = result;
      } else if (result && "success" in result && result.success) {
        data = result.data || [];
      } else {
        // Handle error case if it's an object but success is false
        throw new Error(
          (result as any)?.data?.message || "Failed to fetch reports"
        );
      }
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const addNewMessage = (reportId: number, message: any) => {
    setReports((prevReports) =>
      prevReports.map((report) => {
        if (report.id === reportId) {
          return {
            ...report,
            publicMessages: [...(report.publicMessages || []), message],
          };
        }
        return report;
      })
    );
  };

  return { reports, loading, error, refetch: fetchReports, addNewMessage };
}
