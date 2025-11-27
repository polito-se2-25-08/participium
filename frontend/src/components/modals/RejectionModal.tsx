import { useState } from "react";
import DangerButton from "../buttons/variants/danger/DangerButton";

interface RejectionModalProps {
  isOpen: boolean;
  reportTitle: string;
  onClose: () => void;
  onConfirm: (motivation: string) => void;
  isProcessing?: boolean;
}

export default function RejectionModal({
  isOpen,
  reportTitle,
  onClose,
  onConfirm,
  isProcessing = false,
}: RejectionModalProps) {
  const [motivation, setMotivation] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivation.trim()) {
      setError("Rejection explanation is required");
      return;
    }

    if (motivation.trim().length < 10) {
      setError("Explanation must be at least 10 characters");
      return;
    }

    setError("");
    onConfirm(motivation.trim());
  };

  const handleClose = () => {
    if (!isProcessing) {
      setMotivation("");
      setError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Reject Report
          </h2>
          <p className="text-sm text-gray-600">
            You are about to reject: <span className="font-medium">{reportTitle}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="motivation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rejection Explanation <span className="text-red-500">*</span>
            </label>
            <textarea
              id="motivation"
              value={motivation}
              onChange={(e) => {
                setMotivation(e.target.value);
                setError("");
              }}
              placeholder="Please provide a detailed explanation for rejecting this report..."
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={isProcessing}
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum 10 characters required
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <DangerButton
              type="submit"
              pending={isProcessing}
            >
              Confirm Rejection
            </DangerButton>
          </div>
        </form>
      </div>
    </div>
  );
}
