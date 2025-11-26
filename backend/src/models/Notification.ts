export type NotificationType = 'STATUS_UPDATE' | 'NEW_MESSAGE';

export interface Notification {
  id: number;
  user_id: number;
  report_id: number;
  type: NotificationType;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationInsert {
  user_id: number;
  report_id: number;
  type: NotificationType;
  message: string;
}