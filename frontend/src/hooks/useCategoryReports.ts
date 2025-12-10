import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../components/providers/AuthContext";
import type { Report } from "../types";
import { reportService } from "../api/reportService";
interface UseCategoryReportsReturn {
  reports: Report[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  addNewMessage: (reportId: number, message: any) => void;
}

export function useCategoryReports(): UseCategoryReportsReturn {
  const [reports, setReports] = useState<Report[]>([]);
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
      let data: Report[] = [];
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
            messages: [...(report.messages || []), message],
          };
        }
        return report;
      })
    );
  };

  return { reports, loading, error, refetch: fetchReports, addNewMessage };
}
