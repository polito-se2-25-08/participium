import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Notification {
  message: string;
  reportId: number;
  status: string;
  timestamp: string;
}

export const useNotifications = (userId: number | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    console.log("🔵 Registering user with ID:", userId, typeof userId);

    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      newSocket.emit("register", userId);
    });

    newSocket.on("notification", (notification: Notification) => {
      console.log("Received notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const clearNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    clearNotification,
    clearAllNotifications,
    isConnected: socket?.connected || false,
  };
};