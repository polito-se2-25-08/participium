import * as NotificationService from '../../../src/services/NotificationService';
import * as NotificationRepository from '../../../src/repositories/NotificationRepository';

jest.mock('../../../src/repositories/NotificationRepository');

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const notificationData = {
        user_id: 1,
        report_id: 5,
        type: 'STATUS_UPDATE' as const,
        message: 'Your report status has been updated',
      };

      const mockNotification = {
        id: 1,
        ...notificationData,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      (NotificationRepository.createNotification as jest.Mock).mockResolvedValue(mockNotification);

      const result = await NotificationService.createNotification(notificationData);

      expect(NotificationRepository.createNotification).toHaveBeenCalledWith(notificationData);
      expect(result).toEqual(mockNotification);
      expect(result.is_read).toBe(false);
    });

    it('should create notification with different types', async () => {
      const types = ['STATUS_UPDATE', 'NEW_MESSAGE'] as const;

      for (const type of types) {
        const notificationData = {
          user_id: 1,
          report_id: 1,
          type,
          message: `Test message for ${type}`,
        };

        (NotificationRepository.createNotification as jest.Mock).mockResolvedValue({
          id: 1,
          ...notificationData,
        });

        const result = await NotificationService.createNotification(notificationData);
        expect(result.type).toBe(type);
      }
    });

    it('should handle different user IDs', async () => {
      const userIds = [1, 5, 10, 100];

      for (const userId of userIds) {
        const notificationData = {
          user_id: userId,
          report_id: 1,
          type: 'STATUS_UPDATE' as const,
          message: 'Test notification',
        };

        (NotificationRepository.createNotification as jest.Mock).mockResolvedValue({
          id: 1,
          ...notificationData,
        });

        const result = await NotificationService.createNotification(notificationData);
        expect(result.user_id).toBe(userId);
      }
    });
  });

  describe('getUnreadNotifications', () => {
    it('should return unread notifications for user', async () => {
      const mockNotifications = [
        { id: 1, user_id: 1, message: 'Notification 1', is_read: false },
        { id: 2, user_id: 1, message: 'Notification 2', is_read: false },
      ];

      (NotificationRepository.getUnreadNotifications as jest.Mock).mockResolvedValue(mockNotifications);

      const result = await NotificationService.getUnreadNotifications(1);

      expect(NotificationRepository.getUnreadNotifications).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNotifications);
      expect(result).toHaveLength(2);
      expect(result.every(n => n.is_read === false)).toBe(true);
    });

    it('should return empty array if no unread notifications', async () => {
      (NotificationRepository.getUnreadNotifications as jest.Mock).mockResolvedValue([]);

      const result = await NotificationService.getUnreadNotifications(1);

      expect(result).toEqual([]);
    });

    it('should handle different user IDs', async () => {
      const userIds = [1, 5, 10];

      for (const userId of userIds) {
        (NotificationRepository.getUnreadNotifications as jest.Mock).mockResolvedValue([
          { id: 1, user_id: userId, is_read: false },
        ]);

        const result = await NotificationService.getUnreadNotifications(userId);
        expect(result[0].user_id).toBe(userId);
      }
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const mockNotification = {
        id: 1,
        user_id: 1,
        message: 'Test notification',
        is_read: true,
      };

      (NotificationRepository.markAsRead as jest.Mock).mockResolvedValue(mockNotification);

      const result = await NotificationService.markAsRead(1);

      expect(NotificationRepository.markAsRead).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNotification);
      expect(result.is_read).toBe(true);
    });

    it('should handle different notification IDs', async () => {
      const notificationIds = [1, 5, 10, 100];

      for (const notificationId of notificationIds) {
        (NotificationRepository.markAsRead as jest.Mock).mockResolvedValue({
          id: notificationId,
          is_read: true,
        });

        const result = await NotificationService.markAsRead(notificationId);
        expect(result.id).toBe(notificationId);
        expect(result.is_read).toBe(true);
      }
    });

    it('should handle repository errors', async () => {
      (NotificationRepository.markAsRead as jest.Mock).mockRejectedValue(
        new Error('Notification not found')
      );

      await expect(NotificationService.markAsRead(999)).rejects.toThrow('Notification not found');
    });
  });
});
