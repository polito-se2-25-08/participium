import { getIO, connectedUsers } from "../socket";
import * as NotificationService from "../services/NotificationService";

/**
 * Unified notification helper that handles both DB storage and real-time socket delivery
 * @param userId - The ID of the user to notify
 * @param reportId - The ID of the report related to the notification
 * @param type - The type of notification (STATUS_UPDATE, NEW_MESSAGE, etc.)
 * @param message - The notification message text
 * @param additionalData - Any additional data to include in the socket emission
 */
export const sendNotification = async ({
	userId,
	reportId,
	type,
	message,
	additionalData = {},
}: {
	userId: number;
	reportId: number;
	type: string;
	message: string;
	additionalData?: Record<string, any>;
}) => {
	// Debug: log inputs to help diagnose type issues
	console.log(
		"sendNotification inputs:",
		{ userId, reportId, type, message },
		`types => userId:${typeof userId}, reportId:${typeof reportId}, type:${typeof type}, message:${typeof message}`
	);
	// Always save notification to database
	await NotificationService.createNotification(userId, reportId, type, message);

	// Try to deliver in real-time via WebSocket if user is online
	const socketId = connectedUsers.get(userId);
	if (socketId) {
		try {
			getIO().to(socketId).emit("notification", {
				type,
				message,
				reportId,
				timestamp: new Date().toISOString(),
				...additionalData,
			});
			console.log(`Real-time notification sent to user ${userId} for report ${reportId}`);
		} catch (error) {
			console.error(`Failed to send real-time notification to user ${userId}:`, error);
		}
	} else {
		console.log(`User ${userId} is offline, notification saved to DB only`);
	}
};
