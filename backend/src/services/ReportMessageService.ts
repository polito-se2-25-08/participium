import { ReportMessage, ReportMessageInsert } from "../models/ReportMessage";
import * as ReportMessageRepository from "../repositories/ReportMessageRepository";
import * as NotificationService from "./NotificationService";
import { getIO, connectedUsers } from "../socket";

export const createMessage = async (
	messageData: ReportMessageInsert,
	recipientId: number
): Promise<ReportMessage> => {
	// Save message to DB
	const message = await ReportMessageRepository.createMessage(messageData);

	// Create notification for recipient
	const notification = await NotificationService.createNotification({
		user_id: recipientId,
		report_id: messageData.report_id,
		type: "NEW_MESSAGE",
		message: `New message on report #${messageData.report_id}`,
	});

	// Try to send via WebSocket if user is online
	const socketId = connectedUsers.get(recipientId);
	if (socketId) {
		getIO().to(socketId).emit("notification", {
			id: notification.id,
			message: notification.message,
			reportId: messageData.report_id,
			type: "NEW_MESSAGE",
			timestamp: notification.created_at,
		});
		console.log(`Notification sent to user ${recipientId} for new message`);
	} else {
		console.log(
			`User ${recipientId} is not connected, notification saved to DB`
		);
	}

	return message;
};

export const getMessagesByReportId = async (
	reportId: number
): Promise<ReportMessage[]> => {
	return await ReportMessageRepository.getMessagesByReportId(reportId);
};
