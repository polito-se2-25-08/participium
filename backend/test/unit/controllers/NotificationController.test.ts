import { Request, Response } from 'express';
import * as NotificationController from '../../../src/controllers/NotificationController';
import * as NotificationService from '../../../src/services/NotificationService';

jest.mock('../../../src/services/NotificationService');

describe('NotificationController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    responseJson = jest.fn();
    responseStatus = jest.fn(() => ({ json: responseJson })) as any;

    mockRequest = {
      params: {},
      user: undefined,
    } as any;

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };
  });

  describe('getUnreadNotifications', () => {
    it('should return unread notifications for authenticated user', async () => {
      const mockNotifications = [
        { id: 1, user_id: 1, message: 'Notification 1', is_read: false },
        { id: 2, user_id: 1, message: 'Notification 2', is_read: false },
      ];

      (mockRequest as any).user = { id: 1 };
      (NotificationService.getUnreadNotifications as jest.Mock).mockResolvedValue(mockNotifications);

      await NotificationController.getUnreadNotifications(mockRequest as Request, mockResponse as Response);

      expect(NotificationService.getUnreadNotifications).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockNotifications,
      });
    });

    it('should return 401 if user not authenticated', async () => {
      (mockRequest as any).user = undefined;

      await NotificationController.getUnreadNotifications(mockRequest as Request, mockResponse as Response);

      expect(NotificationService.getUnreadNotifications).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Authentication required',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (mockRequest as any).user = { id: 1 };
      (NotificationService.getUnreadNotifications as jest.Mock).mockRejectedValue(error);

      await NotificationController.getUnreadNotifications(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Database error',
      });
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark notification as read', async () => {
      const mockNotification = {
        id: 1,
        user_id: 1,
        message: 'Test notification',
        is_read: true,
      };

      mockRequest.params = { id: '1' };
      (NotificationService.markAsRead as jest.Mock).mockResolvedValue(mockNotification);

      await NotificationController.markNotificationAsRead(mockRequest as Request, mockResponse as Response);

      expect(NotificationService.markAsRead).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockNotification,
      });
    });

    it('should return 400 for invalid notification ID', async () => {
      mockRequest.params = { id: 'invalid' };

      await NotificationController.markNotificationAsRead(mockRequest as Request, mockResponse as Response);

      expect(NotificationService.markAsRead).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid notification ID',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Update failed');
      mockRequest.params = { id: '1' };
      (NotificationService.markAsRead as jest.Mock).mockRejectedValue(error);

      await NotificationController.markNotificationAsRead(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Update failed',
      });
    });
  });
});
