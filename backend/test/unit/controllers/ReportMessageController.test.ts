import { Request, Response } from 'express';
import * as ReportMessageController from '../../../src/controllers/ReportMessageController';
import * as ReportMessageService from '../../../src/services/ReportMessageService';
import { supabase } from '../../../src/utils/Supabase';

// Mock dependencies
jest.mock('../../../src/services/ReportMessageService');
jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

describe('ReportMessageController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    responseJson = jest.fn();
    responseStatus = jest.fn(() => ({ json: responseJson }));

    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    } as any;
  });

  describe('sendPublicMessage', () => {
    it('should return 400 if report ID is invalid', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { message: 'Hello', senderId: 1 };

      await ReportMessageController.sendPublicMessage(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID or message or sender ID',
      });
    });

    it('should return 400 if senderId is missing', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { message: 'Hello' };

      await ReportMessageController.sendPublicMessage(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID or message or sender ID',
      });
    });

    it('should send public message successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { message: 'Hello', senderId: 1 };

      const mockSavedMessage = {
        id: 1,
        reportId: 1,
        senderId: 1,
        message: 'Hello',
        createdAt: '2024-01-01T00:00:00Z',
        isPublic: true,
      };

      (ReportMessageService.createPublicMessage as jest.Mock).mockResolvedValue(mockSavedMessage);

      await ReportMessageController.sendPublicMessage(mockRequest as Request, mockResponse as Response);

      expect(ReportMessageService.createPublicMessage).toHaveBeenCalledWith(1, 1, 'Hello');
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockSavedMessage,
      });
    });

    it('should handle errors during message sending', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { message: 'Hello', senderId: 1 };

      (ReportMessageService.createPublicMessage as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ReportMessageController.sendPublicMessage(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Database error',
      });
    });
  });

  describe('sendInternalMessage', () => {
    it('should send internal message successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { message: 'Hello', senderId: 1 };

      const mockSavedMessage = {
        id: 1,
        report_id: 1,
        sender_id: 1,
        message: 'Hello',
        created_at: '2024-01-01T00:00:00Z',
        is_public: false,
      };

      (ReportMessageService.createInternalMessage as jest.Mock).mockResolvedValue(mockSavedMessage);

      await ReportMessageController.sendInternalMessage(mockRequest as Request, mockResponse as Response);

      expect(ReportMessageService.createInternalMessage).toHaveBeenCalledWith(1, 1, 'Hello');
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockSavedMessage,
      });
    });
  });

  describe('getMessages', () => {
    it('should return 400 if report ID is invalid', async () => {
      mockRequest.params = { id: 'invalid' };

      await ReportMessageController.getMessages(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID',
      });
    });

    it('should return messages successfully', async () => {
      mockRequest.params = { id: '1' };

      const mockMessages = [
        { id: 1, message: 'Hello' },
        { id: 2, message: 'Hi' },
      ];

      (ReportMessageService.getMessagesByReportId as jest.Mock).mockResolvedValue(mockMessages);

      await ReportMessageController.getMessages(mockRequest as Request, mockResponse as Response);

      expect(ReportMessageService.getMessagesByReportId).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockMessages,
      });
    });

    it('should handle errors during fetching messages', async () => {
      mockRequest.params = { id: '1' };

      (ReportMessageService.getMessagesByReportId as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ReportMessageController.getMessages(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Database error',
      });
    });
  });
});
