import { Notification, NotificationInsert } from "../models/Notification";
import * as NotificationRepository from "../repositories/NotificationRepository";

export const createNotification = async (
	senderId: number,
	reportId: number,
	type: string,
	message: string
): Promise<Notification> => {
	return await NotificationRepository.createNotification({
		user_id: senderId,
		report_id: reportId,
		type,
		message,
	});
};

export const getUnreadNotifications = async (
	userId: number
): Promise<Notification[]> => {
	return await NotificationRepository.getUnreadNotifications(userId);
};

export const markAsRead = async (
	notificationId: number
): Promise<Notification> => {
	return await NotificationRepository.markAsRead(notificationId);
};
