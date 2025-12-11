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

  describe('sendMessage', () => {
    it('should return 400 if report ID is invalid', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { message: 'Hello', senderId: 1 };

      await ReportMessageController.sendMessage(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID',
      });
    });

    it('should return 400 if message is empty', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { message: '   ', senderId: 1 };

      await ReportMessageController.sendMessage(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Message is required',
      });
    });

    it('should return 401 if senderId is missing', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { message: 'Hello' };

      await ReportMessageController.sendMessage(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Authentication required',
      });
    });

    it('should return 404 if report is not found', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { message: 'Hello', senderId: 1 };

      (supabase.from('Report').select('user_id').eq('id', 1).single as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      await ReportMessageController.sendMessage(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Report not found',
      });
    });

    it('should send message successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { message: 'Hello', senderId: 1 };

      (supabase.from('Report').select('user_id').eq('id', 1).single as jest.Mock).mockResolvedValue({
        data: { user_id: 2 },
        error: null,
      });

      const mockSavedMessage = {
        id: 1,
        report_id: 1,
        sender_id: 1,
        message: 'Hello',
        created_at: new Date(),
      };

      (ReportMessageService.createMessage as jest.Mock).mockResolvedValue(mockSavedMessage);

      await ReportMessageController.sendMessage(mockRequest as Request, mockResponse as Response);

      expect(ReportMessageService.createMessage).toHaveBeenCalledWith(
        {
          report_id: 1,
          sender_id: 1,
          message: 'Hello',
        },
        2 // recipientId (report owner)
      );
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockSavedMessage,
      });
    });

    it('should handle errors during message sending', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { message: 'Hello', senderId: 1 };

      (supabase.from('Report').select('user_id').eq('id', 1).single as jest.Mock).mockResolvedValue({
        data: { user_id: 2 },
        error: null,
      });

      (ReportMessageService.createMessage as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ReportMessageController.sendMessage(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Database error',
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
