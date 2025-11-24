import { useState } from 'react';
import { reportService } from '../api/reportService';

interface RejectionModalState {
  isOpen: boolean;
  reportId: number | null;
  reportTitle: string;
}

export function useReportActions(onSuccess?: () => void) {
  const [processingReportId, setProcessingReportId] = useState<number | null>(null);
  const [rejectionModal, setRejectionModal] = useState<RejectionModalState>({
    isOpen: false,
    reportId: null,
    reportTitle: "",
  });

  const handleApprove = async (reportId: number) => {
    setProcessingReportId(reportId);
    try {
      const result = await reportService.approveReport(reportId);
      if (result.success) {
        onSuccess?.(); // to refresh the list
      } else {
        console.error("Failed to approve report:", result.data);
        const errorMessage = typeof result.data === 'string' 
          ? result.data 
          : 'Failed to approve report';
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error approving report:", error);
      alert("Network error: Unable to approve report");
    } finally {
      setProcessingReportId(null);
    }
  };

  const openRejectionModal = (reportId: number, reportTitle: string) => {
    setRejectionModal({
      isOpen: true,
      reportId,
      reportTitle,
    });
  };

  const closeRejectionModal = () => {
    setRejectionModal({ isOpen: false, reportId: null, reportTitle: "" });
  };

  const handleReject = async (motivation: string) => {
    if (rejectionModal.reportId) {
      setProcessingReportId(rejectionModal.reportId);
      try {
        const result = await reportService.rejectReport(rejectionModal.reportId, motivation);
        if (result.success) {
          closeRejectionModal();
          onSuccess?.(); // Refresh the list
        } else {
          console.error("Failed to reject report:", result.data);
          const errorMessage = typeof result.data === 'string' 
            ? result.data 
            : 'Failed to reject report';
          alert(errorMessage);
        }
      } catch (error) {
        console.error("Error rejecting report:", error);
        alert("Network error: Unable to reject report");
      } finally {
        setProcessingReportId(null);
      }
    }
  };

  return {
    processingReportId,
    rejectionModal,
    handleApprove,
    openRejectionModal,
    closeRejectionModal,
    handleReject,
  };
}
