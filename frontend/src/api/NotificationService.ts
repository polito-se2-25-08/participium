import type { ApiResponse } from '../interfaces/dto/Response';

const API_BASE = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api/v1';

export interface Notification {
  id: number;
  user_id: number;
  report_id: number;
  type: "STATUS_UPDATE" | "NEW_MESSAGE";
  message: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  async getUnreadNotifications(): Promise<ApiResponse<Notification[]>> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      const result: ApiResponse<Notification[]> = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      const message = error instanceof Error ? error.message : "Cannot reach server";
      return { success: false, data: { message } };
    }
  },

  async markNotificationAsRead(notificationId: number): Promise<ApiResponse<Notification>> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      const result: ApiResponse<Notification> = await response.json();
      return result;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      const message = error instanceof Error ? error.message : "Cannot reach server";
      return { success: false, data: { message } };
    }
  },
};