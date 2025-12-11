import { Request, Response } from "express";
import * as NotificationService from "../services/NotificationService";
import { ApiResponse } from "../dto/ReportDTO";
import { Notification } from "../models/Notification";

export const getUnreadNotifications = async (req: Request, res: Response) => {
  try {
    const authenticatedUser = (req as any).user;
    const userId = authenticatedUser?.id;

    if (!userId) {
      const response: ApiResponse<string> = {
        success: false,
        data: "Authentication required",
      };
      return res.status(401).json(response);
    }

    const notifications = await NotificationService.getUnreadNotifications(userId);
    const response: ApiResponse<Notification[]> = {
      success: true,
      data: notifications,
    };
    return res.status(200).json(response);
  } catch (err: any) {
    console.error("Error fetching notifications:", err);
    const response: ApiResponse<string> = {
      success: false,
      data: err.message || "Unknown error occurred",
    };
    return res.status(500).json(response);
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
      const response: ApiResponse<string> = {
        success: false,
        data: "Invalid notification ID",
      };
      return res.status(400).json(response);
    }

    const notification = await NotificationService.markAsRead(numericId);
    const response: ApiResponse<Notification> = {
      success: true,
      data: notification,
    };
    return res.status(200).json(response);
  } catch (err: any) {
    console.error("Error marking notification as read:", err);
    const response: ApiResponse<string> = {
      success: false,
      data: err.message || "Unknown error occurred",
    };
    return res.status(500).json(response);
  }
};