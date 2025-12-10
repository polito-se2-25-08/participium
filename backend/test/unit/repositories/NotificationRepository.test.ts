import * as NotificationRepository from '../../../src/repositories/NotificationRepository';
import { supabase } from '../../../src/utils/Supabase';
import AppError from '../../../src/utils/AppError';

jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('NotificationRepository', () => {
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;
  let mockInsert: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockEq: jest.Mock;
  let mockOrder: jest.Mock;
  let mockSingle: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSingle = jest.fn();
    mockOrder = jest.fn();
    mockEq = jest.fn(() => ({ eq: mockEq, order: mockOrder, select: mockSelect, single: mockSingle }));
    mockSelect = jest.fn(() => ({ eq: mockEq, single: mockSingle }));
    mockInsert = jest.fn(() => ({ select: mockSelect }));
    mockUpdate = jest.fn(() => ({ eq: mockEq }));
    mockFrom = jest.fn(() => ({
      insert: mockInsert,
      select: mockSelect,
      update: mockUpdate,
    }));

    (supabase.from as jest.Mock) = mockFrom;
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
        created_at: '2024-01-01T00:00:00Z',
      };

      mockSingle.mockResolvedValue({ data: mockNotification, error: null });

      const result = await NotificationRepository.createNotification(notificationData);

      expect(mockFrom).toHaveBeenCalledWith('Notification');
      expect(mockInsert).toHaveBeenCalledWith([notificationData]);
      expect(result).toEqual(mockNotification);
    });

    it('should throw AppError on database error', async () => {
      const notificationData = {
        user_id: 1,
        report_id: 5,
        type: 'STATUS_UPDATE' as const,
        message: 'Test',
      };

      const dbError = new Error('Insert failed');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(
        NotificationRepository.createNotification(notificationData)
      ).rejects.toThrow(AppError);

      await expect(
        NotificationRepository.createNotification(notificationData)
      ).rejects.toThrow('Failed to create notification');
    });

    it('should handle different notification types', async () => {
      const types = ['STATUS_UPDATE', 'NEW_MESSAGE'] as const;

      for (const type of types) {
        const notificationData = {
          user_id: 1,
          report_id: 1,
          type,
          message: `Test ${type}`,
        };

        mockSingle.mockResolvedValue({
          data: { id: 1, ...notificationData },
          error: null,
        });

        const result = await NotificationRepository.createNotification(notificationData);
        expect(result.type).toBe(type);
      }
    });
  });

  describe('getUnreadNotifications', () => {
    it('should return unread notifications for user', async () => {
      const mockNotifications = [
        { id: 1, user_id: 1, message: 'Notification 1', is_read: false },
        { id: 2, user_id: 1, message: 'Notification 2', is_read: false },
      ];

      mockOrder.mockResolvedValue({ data: mockNotifications, error: null });

      const result = await NotificationRepository.getUnreadNotifications(1);

      expect(mockFrom).toHaveBeenCalledWith('Notification');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', 1);
      expect(mockEq).toHaveBeenCalledWith('is_read', false);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockNotifications);
    });

    it('should return empty array if no unread notifications', async () => {
      mockOrder.mockResolvedValue({ data: null, error: null });

      const result = await NotificationRepository.getUnreadNotifications(1);

      expect(result).toEqual([]);
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Database error');
      mockOrder.mockResolvedValue({ data: null, error: dbError });

      await expect(
        NotificationRepository.getUnreadNotifications(1)
      ).rejects.toThrow(AppError);

      await expect(
        NotificationRepository.getUnreadNotifications(1)
      ).rejects.toThrow('Failed to fetch notifications');
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

      mockSingle.mockResolvedValue({ data: mockNotification, error: null });

      const result = await NotificationRepository.markAsRead(1);

      expect(mockFrom).toHaveBeenCalledWith('Notification');
      expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
      expect(mockEq).toHaveBeenCalledWith('id', 1);
      expect(result).toEqual(mockNotification);
    });

    it('should throw AppError if notification not found', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      await expect(
        NotificationRepository.markAsRead(999)
      ).rejects.toThrow(AppError);

      await expect(
        NotificationRepository.markAsRead(999)
      ).rejects.toThrow('Notification with id 999 not found');
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Update failed');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(
        NotificationRepository.markAsRead(1)
      ).rejects.toThrow(AppError);

      await expect(
        NotificationRepository.markAsRead(1)
      ).rejects.toThrow('Failed to mark notification as read');
    });
  });
});
