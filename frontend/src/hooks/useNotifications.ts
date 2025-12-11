import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { notificationService } from "../api/NotificationService";

interface Notification {
	id?: number;
	message: string;
	reportId: number;
	status?: string;
	type?: "STATUS_UPDATE" | "NEW_MESSAGE";
	timestamp: string;
}

export const useNotifications = (userId: number | null) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!userId) return;

		const fetchNotifications = async () => {
			setIsLoading(true);
			try {
				const response =
					await notificationService.getUnreadNotifications();

				if (response.success && Array.isArray(response.data)) {
					// Transform backend format to frontend format
					const transformedNotifications = response.data.map(
						(notif) => ({
							id: notif.id,
							message: notif.message,
							reportId: notif.report_id,
							type: notif.type,
							timestamp: notif.created_at,
						})
					);

					setNotifications(transformedNotifications);
					console.log(
						"📬 Loaded unread notifications:",
						transformedNotifications.length
					);
				}
			} catch (error) {
				console.error("Failed to fetch notifications:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchNotifications();
	}, [userId]);

	// WebSocket connection for real-time notifications
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

	const clearNotification = async (index: number) => {
		const notification = notifications[index];

		// Mark as read in backend if it has an id (from DB)
		if (notification.id) {
			try {
				await notificationService.markNotificationAsRead(
					notification.id
				);
				console.log("✅ Marked notification as read:", notification.id);
			} catch (error) {
				console.error("Failed to mark notification as read:", error);
			}
		}

		setNotifications((prev) => prev.filter((_, i) => i !== index));
	};

	const clearAllNotifications = async () => {
		// Mark all as read in backend
		try {
			await Promise.all(
				notifications
					.filter((n) => n.id)
					.map((n) =>
						notificationService.markNotificationAsRead(n.id!)
					)
			);
			console.log("✅ Marked all notifications as read");
		} catch (error) {
			console.error("Failed to mark notifications as read:", error);
		}

		setNotifications([]);
	};

	return {
		notifications,
		clearNotification,
		clearAllNotifications,
		isConnected: socket?.connected || false,
		isLoading,
	};
};
