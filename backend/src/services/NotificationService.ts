import { Notification, NotificationInsert } from "../models/Notification";
import * as NotificationRepository from "../repositories/NotificationRepository";

export const createNotification = async (
  notificationData: NotificationInsert
): Promise<Notification> => {
  return await NotificationRepository.createNotification(notificationData);
};

export const getUnreadNotifications = async (
  userId: number
): Promise<Notification[]> => {
  return await NotificationRepository.getUnreadNotifications(userId);
};

export const markAsRead = async (notificationId: number): Promise<Notification> => {
  return await NotificationRepository.markAsRead(notificationId);
};