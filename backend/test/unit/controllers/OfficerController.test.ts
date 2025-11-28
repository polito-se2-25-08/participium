import { Request, Response } from 'express';
import * as OfficerController from '../../../src/controllers/OfficerController';
import * as OfficerService from '../../../src/services/OfficerService';

jest.mock('../../../src/services/OfficerService');

describe('OfficerController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    responseJson = jest.fn();
    responseStatus = jest.fn(() => ({ json: responseJson })) as any;

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };
  });

  describe('getAllReports', () => {
    it('should return all reports', async () => {
      const mockReports = [
        { id: 1, title: 'Report 1', status: 'PENDING_APPROVAL' },
        { id: 2, title: 'Report 2', status: 'ASSIGNED' },
      ];

      (OfficerService.getAllReports as jest.Mock).mockResolvedValue(mockReports);

      await OfficerController.getAllReports(mockRequest as Request, mockResponse as Response);

      expect(OfficerService.getAllReports).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReports,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (OfficerService.getAllReports as jest.Mock).mockRejectedValue(error);

      await OfficerController.getAllReports(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Database error',
      });
    });
  });

  describe('updateReportStatus', () => {
    it('should update report status', async () => {
      const mockReport = { id: 1, status: 'IN_PROGRESS' };

      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'IN_PROGRESS' };
      (OfficerService.updateReportStatus as jest.Mock).mockResolvedValue(mockReport);

      await OfficerController.updateReportStatus(mockRequest as Request, mockResponse as Response);

      expect(OfficerService.updateReportStatus).toHaveBeenCalledWith(1, 'IN_PROGRESS');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Update failed');
      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'IN_PROGRESS' };
      (OfficerService.updateReportStatus as jest.Mock).mockRejectedValue(error);

      await OfficerController.updateReportStatus(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Update failed',
      });
    });
  });

  describe('getReportById', () => {
    it('should return report by id', async () => {
      const mockReport = {
        id: 1,
        title: 'Test Report',
        status: 'PENDING_APPROVAL',
      };

      mockRequest.params = { id: '1' };
      (OfficerService.getReportById as jest.Mock).mockResolvedValue(mockReport);

      await OfficerController.getReportById(mockRequest as Request, mockResponse as Response);

      expect(OfficerService.getReportById).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Report not found');
      mockRequest.params = { id: '999' };
      (OfficerService.getReportById as jest.Mock).mockRejectedValue(error);

      await OfficerController.getReportById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Report not found',
      });
    });
  });

  describe('approveReport', () => {
    it('should approve a report', async () => {
      const mockReport = { id: 1, status: 'ASSIGNED' };

      mockRequest.params = { id: '1' };
      (OfficerService.approveReport as jest.Mock).mockResolvedValue(mockReport);

      await OfficerController.approveReport(mockRequest as Request, mockResponse as Response);

      expect(OfficerService.approveReport).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
    });

    it('should return 400 for invalid report ID', async () => {
      mockRequest.params = { id: 'invalid' };

      await OfficerController.approveReport(mockRequest as Request, mockResponse as Response);

      expect(OfficerService.approveReport).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID',
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Approval failed');
      mockRequest.params = { id: '1' };
      (OfficerService.approveReport as jest.Mock).mockRejectedValue(error);

      await OfficerController.approveReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Approval failed',
      });
    });
  });

  describe('rejectReport', () => {
    it('should reject a report with motivation', async () => {
      const mockReport = { id: 1, status: 'REJECTED' };

      mockRequest.params = { id: '1' };
      mockRequest.body = { motivation: 'Duplicate report' };
      (OfficerService.rejectReport as jest.Mock).mockResolvedValue(mockReport);

      await OfficerController.rejectReport(mockRequest as Request, mockResponse as Response);

      expect(OfficerService.rejectReport).toHaveBeenCalledWith(1, 'Duplicate report');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
    });

    it('should return 400 for invalid report ID', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { motivation: 'Test' };

      await OfficerController.rejectReport(mockRequest as Request, mockResponse as Response);

      expect(OfficerService.rejectReport).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Invalid report ID',
      });
    });

    it('should return 400 for validation errors', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { motivation: '' };

      await OfficerController.rejectReport(mockRequest as Request, mockResponse as Response);

      expect(OfficerService.rejectReport).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
    });

    it('should handle errors', async () => {
      const error = new Error('Rejection failed');
      mockRequest.params = { id: '1' };
      mockRequest.body = { motivation: 'Insufficient information' };
      (OfficerService.rejectReport as jest.Mock).mockRejectedValue(error);

      await OfficerController.rejectReport(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: 'Rejection failed',
      });
    });
  });
});
