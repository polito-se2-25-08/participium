import { useState, useEffect } from 'react';
import type { Report } from '../../types';
import { reportService } from '../../api/reportService';

export function usePendingReports() {
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
      
      if (result && typeof result === 'object') {
        if ('success' in result && result.success && result.data) {
          const pendingReports = filterPendingReports(result.data);
          setReports(pendingReports);
        } else if (Array.isArray(result)) {
          const pendingReports = filterPendingReports(result);
          setReports(pendingReports);
        } else {
          setError((result as any).data?.message || (result as any).message || "Failed to load pending reports");
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
      (report) => report.status === "pending_approval" || report.status === null
    );
  };

  return { reports, loading, error, refetch: fetchPendingReports };
}
