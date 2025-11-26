import { Notification, NotificationInsert } from "../models/Notification";
import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const createNotification = async (
  notificationData: NotificationInsert
): Promise<Notification> => {
  const { data, error } = await supabase
    .from("Notification")
    .insert([notificationData])
    .select()
    .single();

  if (error) {
    throw new AppError(
      `Failed to create notification: ${error.message}`,
      500,
      "DB_INSERT_ERROR"
    );
  }

  return data;
};

export const getUnreadNotifications = async (
  userId: number
): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from("Notification")
    .select("*")
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError(
      `Failed to fetch notifications: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }

  return data || [];
};

export const markAsRead = async (notificationId: number): Promise<Notification> => {
  const { data, error } = await supabase
    .from("Notification")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single();

  if (error) {
    throw new AppError(
      `Failed to mark notification as read: ${error.message}`,
      500,
      "DB_UPDATE_ERROR"
    );
  }

  if (!data) {
    throw new AppError(
      `Notification with id ${notificationId} not found`,
      404,
      "NOTIFICATION_NOT_FOUND"
    );
  }

  return data;
};