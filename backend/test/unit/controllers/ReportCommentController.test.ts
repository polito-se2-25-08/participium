import { Request, Response } from 'express';
import * as ReportCommentController from '../../../src/controllers/ReportCommentController';
import * as ReportCommentService from '../../../src/services/ReportCommentService';
import { userRepository } from '../../../src/repositories/userRepository';

jest.mock('../../../src/services/ReportCommentService');
jest.mock('../../../src/repositories/userRepository');

describe('ReportCommentController', () => {
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
      body: {},
      user: undefined,
    } as any;

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };
  });

  describe('addComment', () => {
    it('should add a comment successfully', async () => {
      const reportId = 1;
      const userId = 1;
      const content = 'Test comment';

      mockRequest.params = { id: reportId.toString() };
      mockRequest.body = { content };
      (mockRequest as any).user = { id: userId };

      const mockSavedComment = {
        id: 1,
        report_id: reportId,
        sender_id: userId,
        message: content,
        created_at: new Date().toISOString(),
      };

      const mockUser = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        role: 'OFFICER',
        profile_picture: 'pic.jpg',
      };

      (ReportCommentService.createComment as jest.Mock).mockResolvedValue(mockSavedComment);
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      await ReportCommentController.addComment(mockRequest as Request, mockResponse as Response);

      expect(ReportCommentService.createComment).toHaveBeenCalledWith({
        report_id: reportId,
        sender_id: userId,
        message: content,
      });
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: {
          id: mockSavedComment.id,
          reportId: mockSavedComment.report_id,
          userId: mockSavedComment.sender_id,
          user: {
            name: mockUser.name,
            surname: mockUser.surname,
            role: mockUser.role,
            profile_picture: mockUser.profile_picture,
          },
          content: mockSavedComment.message,
          createdAt: mockSavedComment.created_at,
        },
      });
    });

    it('should return 400 if report ID is invalid', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { content: 'Test' };

      await ReportCommentController.addComment(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID',
      });
    });

    it('should return 400 if content is missing', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { content: '' };

      await ReportCommentController.addComment(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Content is required',
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { content: 'Test' };
      (mockRequest as any).user = undefined;

      await ReportCommentController.addComment(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Authentication required',
      });
    });

    it('should return 500 if service throws error', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { content: 'Test' };
      (mockRequest as any).user = { id: 1 };

      (ReportCommentService.createComment as jest.Mock).mockRejectedValue(new Error('Service error'));

      await ReportCommentController.addComment(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Service error',
      });
    });
  });

  describe('getComments', () => {
    it('should return comments for a report', async () => {
      const reportId = 1;
      mockRequest.params = { id: reportId.toString() };

      const mockComments = [
        {
          id: 1,
          report_id: reportId,
          sender_id: 1,
          message: 'Comment 1',
          created_at: new Date().toISOString(),
          sender: {
            id: 1,
            name: 'John',
            surname: 'Doe',
            role: 'OFFICER',
            profile_picture: 'pic.jpg',
          },
        },
      ];

      (ReportCommentService.getCommentsByReportId as jest.Mock).mockResolvedValue(mockComments);

      await ReportCommentController.getComments(mockRequest as Request, mockResponse as Response);

      expect(ReportCommentService.getCommentsByReportId).toHaveBeenCalledWith(reportId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            id: mockComments[0].id,
            reportId: mockComments[0].report_id,
            userId: mockComments[0].sender_id,
            user: {
              name: mockComments[0].sender.name,
              surname: mockComments[0].sender.surname,
              role: mockComments[0].sender.role,
              profile_picture: mockComments[0].sender.profile_picture,
            },
            content: mockComments[0].message,
            createdAt: mockComments[0].created_at,
          },
        ],
      });
    });

    it('should return 400 if report ID is invalid', async () => {
      mockRequest.params = { id: 'invalid' };

      await ReportCommentController.getComments(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID',
      });
    });

    it('should return 500 if service throws error', async () => {
      mockRequest.params = { id: '1' };
      (ReportCommentService.getCommentsByReportId as jest.Mock).mockRejectedValue(new Error('Service error'));

      await ReportCommentController.getComments(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Service error',
      });
    });
  });
});
