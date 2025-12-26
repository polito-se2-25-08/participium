import { Request, Response } from 'express';
import * as ReportController from '../../../src/controllers/ReportController';
import * as ReportService from '../../../src/services/ReportService';
import * as TechnicianService from '../../../src/services/TechnicianService';
import { getCategoryId } from '../../../src/utils/categoryMapper';

// Mock dependencies
jest.mock('../../../src/services/ReportService');
jest.mock('../../../src/services/TechnicianService');
jest.mock('../../../src/utils/categoryMapper');
jest.mock('../../../src/bot'); // Mock bot
const mockIO = {
  to: jest.fn().mockReturnThis(),
  emit: jest.fn(),
};

jest.mock('../../../src/socket', () => ({
  getIO: jest.fn(() => mockIO),
  connectedUsers: new Map(),
}));
jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('ReportController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseStatus: jest.Mock;
  let responseJson: jest.Mock;

  beforeEach(() => {
    responseStatus = jest.fn().mockReturnThis();
    responseJson = jest.fn().mockReturnThis();

    mockRequest = {
      body: {},
      params: {},
      query: {},
    } as any;

    (mockRequest as any).user = { id: 1, role: 'CITIZEN' };

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };

    jest.clearAllMocks();
  });

  describe('createReport', () => {
    it('should create report successfully', async () => {
      const reportData = {
        title: 'Test Report',
        description: 'Test Description',
        category: 'pothole',
        latitude: 40.7128,
        longitude: -74.0060,
        anonymous: false,
        photos: ['photo1.jpg'],
      };

      const mockCreatedReport = {
        id: 1,
        ...reportData,
        category_id: 1,
        user_id: 1,
        status: 'PENDING',
      };

      mockRequest.body = reportData;
      (getCategoryId as jest.Mock).mockReturnValue(1);
      (ReportService.createReport as jest.Mock).mockResolvedValue(mockCreatedReport);

      await ReportController.createReport(mockRequest as Request, mockResponse as Response);

      expect(getCategoryId).toHaveBeenCalledWith('pothole');
      expect(ReportService.createReport).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedReport,
      });
    });

    it('should return 401 if user not authenticated', async () => {
      (mockRequest as any).user = undefined;
      mockRequest.body = { title: 'Test', category: 'pothole' };

      await ReportController.createReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Authentication required',
      });
    });

    it('should handle errors', async () => {
      mockRequest.body = {
        title: 'Test',
        category: 'pothole',
        latitude: 40,
        longitude: -74,
      };
      (getCategoryId as jest.Mock).mockReturnValue(1);
      (ReportService.createReport as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ReportController.createReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Database error',
      });
    });
  });

  describe('getAllReports', () => {
    it('should get all reports successfully', async () => {
      const mockReports = [{ id: 1, title: 'Test Report' }];
      (mockRequest as any).user = undefined;

      (ReportService.getAllReports as jest.Mock).mockResolvedValue(mockReports);

      await ReportController.getAllReports(mockRequest as Request, mockResponse as Response);

      expect(ReportService.getAllReports).toHaveBeenCalledWith();
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReports,
      });
    });

    it('should handle errors', async () => {
      (ReportService.getAllReports as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ReportController.getAllReports(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: null,
      });
    });
  });

  describe('getReportById', () => {
    it('should get report by ID successfully', async () => {
      const mockReport = { id: 1, title: 'Test Report' };
      mockRequest.params = { id: '1' };
      (mockRequest as any).user = undefined;

      (ReportService.getReportById as jest.Mock).mockResolvedValue(mockReport);

      await ReportController.getReportById(mockRequest as Request, mockResponse as Response);

      expect(ReportService.getReportById).toHaveBeenCalledWith(1, 'CITIZEN');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
    });

    it('should return 400 for invalid ID', async () => {
      mockRequest.params = { id: 'invalid' };

      await ReportController.getReportById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: null,
      });
    });

    it('should handle errors', async () => {
      mockRequest.params = { id: '1' };
      (ReportService.getReportById as jest.Mock).mockRejectedValue(new Error('Not found'));

      await ReportController.getReportById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('getActiveReports', () => {
    it('should get active reports successfully with CITIZEN role default', async () => {
      const mockReports = [{ id: 1, status: 'PENDING' }];
      (mockRequest as any).user = undefined;

      (ReportService.getActiveReports as jest.Mock).mockResolvedValue(mockReports);

      await ReportController.getActiveReports(mockRequest as Request, mockResponse as Response);

      expect(ReportService.getActiveReports).toHaveBeenCalledWith('CITIZEN');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReports,
      });
    });

    it('should get active reports successfully with OFFICER role', async () => {
      const mockReports = [{ id: 1, status: 'PENDING' }];
      (mockRequest as any).user = { role: 'OFFICER' };

      (ReportService.getActiveReports as jest.Mock).mockResolvedValue(mockReports);

      await ReportController.getActiveReports(mockRequest as Request, mockResponse as Response);

      expect(ReportService.getActiveReports).toHaveBeenCalledWith('OFFICER');
      expect(responseStatus).toHaveBeenCalledWith(200);
    });

    it('should handle service errors', async () => {
      (ReportService.getActiveReports as jest.Mock).mockRejectedValue(new Error('Service error'));

      await ReportController.getActiveReports(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: null,
      });
    });
  });

  describe('getFilteredReports', () => {
    it('should get filtered reports successfully', async () => {
      const mockReports = [{ id: 1, category_id: 1 }];
      mockRequest.query = {
        userId: '1',
        category: 'pothole',
        status: 'PENDING',
      };
      (mockRequest as any).user = undefined;

      (ReportService.getFilteredReports as jest.Mock).mockResolvedValue(mockReports);

      await ReportController.getFilteredReports(mockRequest as Request, mockResponse as Response);

      expect(ReportService.getFilteredReports).toHaveBeenCalledWith(
        '1',
        ['pothole'],
        ['PENDING'],
        undefined,
        undefined,
        'CITIZEN'
      );
      expect(responseStatus).toHaveBeenCalledWith(200);
    });

    it('should handle array category and status', async () => {
      mockRequest.query = {
        category: ['pothole', 'graffiti'],
        status: ['PENDING', 'APPROVED'],
      };
      (mockRequest as any).user = undefined;

      (ReportService.getFilteredReports as jest.Mock).mockResolvedValue([]);

      await ReportController.getFilteredReports(mockRequest as Request, mockResponse as Response);

      expect(ReportService.getFilteredReports).toHaveBeenCalledWith(
        undefined,
        ['pothole', 'graffiti'],
        ['PENDING', 'APPROVED'],
        undefined,
        undefined,
        'CITIZEN'
      );
    });

    it('should handle service errors', async () => {
      mockRequest.query = { userId: '1' };
      (ReportService.getFilteredReports as jest.Mock).mockRejectedValue(new Error('Filter error'));

      await ReportController.getFilteredReports(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: null,
      });
    });
  });

  describe('approveReport', () => {
    it('should approve report successfully', async () => {
      const mockReport = { id: 1, status: 'APPROVED' };
      mockRequest.params = { id: '1' };

      (ReportService.approveReport as jest.Mock).mockResolvedValue(mockReport);

      await ReportController.approveReport(mockRequest as Request, mockResponse as Response);

      expect(ReportService.approveReport).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
    });

    it('should return 400 for invalid ID', async () => {
      mockRequest.params = { id: 'invalid' };

      await ReportController.approveReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID',
      });
    });

    it('should handle service errors', async () => {
      mockRequest.params = { id: '1' };
      (ReportService.approveReport as jest.Mock).mockRejectedValue(new Error('Service error'));

      await ReportController.approveReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Service error',
      });
    });
  });

  describe('rejectReport', () => {
    it('should reject report successfully', async () => {
      const mockReport = { id: 1, status: 'REJECTED' };
      mockRequest.params = { id: '1' };
      mockRequest.body = { motivation: 'Invalid report' };

      (ReportService.rejectReport as jest.Mock).mockResolvedValue(mockReport);

      await ReportController.rejectReport(mockRequest as Request, mockResponse as Response);

      expect(ReportService.rejectReport).toHaveBeenCalledWith(1, 'Invalid report', 1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
    });

    it('should return 400 for invalid ID', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { motivation: 'Test' };

      await ReportController.rejectReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID',
      });
    });

    it('should return 400 for missing motivation', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { motivation: '' };

      await ReportController.rejectReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Rejection motivation is required',
      });
    });

    it('should return 401 if user not authenticated', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { motivation: 'Test' };
      (mockRequest as any).user = undefined;

      await ReportController.rejectReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Authentication required',
      });
    });

    it('should handle service errors', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { motivation: 'Test rejection' };
      (ReportService.rejectReport as jest.Mock).mockRejectedValue(new Error('Rejection failed'));

      await ReportController.rejectReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Rejection failed',
      });
    });
  });

  describe('updateReportStatus', () => {
    it('should update report status successfully', async () => {
      const mockReport = { id: 1, status: 'IN_PROGRESS' };
      const { supabase } = require('../../../src/utils/Supabase');

      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'IN_PROGRESS' };
      (mockRequest as any).user = { id: 1, role: 'TECHNICIAN' }; // Add user

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { user_id: 1, title: 'Test Report' },
              error: null,
            }),
          }),
        }),
      });

      (ReportService.updateReportStatus as jest.Mock).mockResolvedValue(mockReport);
      (TechnicianService.canTechnicianUpdateReport as jest.Mock).mockResolvedValue(true);

      await ReportController.updateReportStatus(mockRequest as Request, mockResponse as Response);

      expect(ReportService.updateReportStatus).toHaveBeenCalledWith(1, 'IN_PROGRESS', 1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
    });

    it('should return 400 for invalid ID', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { status: 'IN_PROGRESS' };

      await ReportController.updateReportStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID',
      });
    });

    it('should return 400 for missing status', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {};

      await ReportController.updateReportStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Status is required',
      });
    });

    it('should return 404 if report not found', async () => {
      const { supabase } = require('../../../src/utils/Supabase');

      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'IN_PROGRESS' };

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: 'Not found',
            }),
          }),
        }),
      });

      await ReportController.updateReportStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Report not found',
      });
    });

    it('should handle service errors', async () => {
      const { supabase } = require('../../../src/utils/Supabase');

      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'IN_PROGRESS' };

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { user_id: 1, title: 'Test' },
              error: null,
            }),
          }),
        }),
      });

      (ReportService.updateReportStatus as jest.Mock).mockRejectedValue(new Error('Update failed'));

      await ReportController.updateReportStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Update failed',
      });
    });

    it('should send WebSocket notification when user is connected', async () => {
      const { supabase } = require('../../../src/utils/Supabase');
      const { getIO, connectedUsers } = require('../../../src/socket');
      const io = getIO();
      const mockReport = { id: 1, status: 'IN_PROGRESS' };

      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'IN_PROGRESS' };
      (mockRequest as any).user = { id: 1, role: 'TECHNICIAN' };

      connectedUsers.set(1, 'socket-123');

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { user_id: 1, title: 'Test Report' },
              error: null,
            }),
          }),
        }),
      });

      (ReportService.updateReportStatus as jest.Mock).mockResolvedValue(mockReport);
      (TechnicianService.canTechnicianUpdateReport as jest.Mock).mockResolvedValue(true);

      await ReportController.updateReportStatus(mockRequest as Request, mockResponse as Response);

      expect(io.to).toHaveBeenCalledWith('socket-123');
      expect(io.emit).toHaveBeenCalledWith('notification', expect.objectContaining({
        reportId: 1,
        status: 'IN_PROGRESS',
        reportTitle: 'Test Report',
      }));
      expect(responseStatus).toHaveBeenCalledWith(200);

      connectedUsers.clear();
    });

    it('should log when user is not connected', async () => {
      const { supabase } = require('../../../src/utils/Supabase');
      const { connectedUsers } = require('../../../src/socket');
      const mockReport = { id: 1, status: 'IN_PROGRESS' };
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'IN_PROGRESS' };
      (mockRequest as any).user = { id: 1, role: 'TECHNICIAN' };

      connectedUsers.clear();

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { user_id: 1, title: 'Test Report' },
              error: null,
            }),
          }),
        }),
      });

      (ReportService.updateReportStatus as jest.Mock).mockResolvedValue(mockReport);
      (TechnicianService.canTechnicianUpdateReport as jest.Mock).mockResolvedValue(true);

      await ReportController.updateReportStatus(mockRequest as Request, mockResponse as Response);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not connected'));
      expect(responseStatus).toHaveBeenCalledWith(200);

      consoleSpy.mockRestore();
    });
  });
});
