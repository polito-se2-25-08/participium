import React from "react";

interface Notification {
  message: string;
  reportId: number;
  status?: string; // Make it optional
  timestamp: string;
}

interface NotificationToastProps {
  notifications: Notification[];
  onClose: (index: number) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={`${notification.reportId}-${notification.timestamp}`}
          className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Report Status Update
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => onClose(index)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};