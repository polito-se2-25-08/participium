import { Request, Response, NextFunction } from 'express';
import * as TechnicianController from '../../../src/controllers/TechnicianController';
import * as TechnicianService from '../../../src/services/TechnicianService';

jest.mock('../../../src/services/TechnicianService');

describe('TechnicianController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    responseJson = jest.fn();
    responseStatus = jest.fn(() => ({ json: responseJson })) as any;
    mockNext = jest.fn();

    mockRequest = {
      query: {},
      user: undefined,
    } as any;

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };
  });

  describe('getReportsForTechnician', () => {
    it('should return reports for authenticated technician', async () => {
      const mockReports = [
        { id: 1, category_id: 3, status: 'ASSIGNED' },
        { id: 2, category_id: 3, status: 'IN_PROGRESS' },
      ];

      (mockRequest as any).user = { id: 5, role: 'TECHNICIAN' };
      (TechnicianService.getReportsForTechnician as jest.Mock).mockResolvedValue(mockReports);

      await TechnicianController.getReportsForTechnician(mockRequest as Request, mockResponse as Response, mockNext);

      expect(TechnicianService.getReportsForTechnician).toHaveBeenCalledWith(5, undefined);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockReports,
      });
    });

    it('should handle status query parameter', async () => {
      const mockReports = [
        { id: 1, category_id: 3, status: 'ASSIGNED' },
      ];

      (mockRequest as any).user = { id: 5, role: 'TECHNICIAN' };
      mockRequest.query = { status: 'ASSIGNED' };
      (TechnicianService.getReportsForTechnician as jest.Mock).mockResolvedValue(mockReports);

      await TechnicianController.getReportsForTechnician(mockRequest as Request, mockResponse as Response, mockNext);

      expect(TechnicianService.getReportsForTechnician).toHaveBeenCalledWith(5, 'ASSIGNED');
      expect(responseStatus).toHaveBeenCalledWith(200);
    });

    it('should throw error if user not authenticated', async () => {
      (mockRequest as any).user = undefined;

      await TechnicianController.getReportsForTechnician(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Wait for async operations to complete
      await new Promise(resolve => setImmediate(resolve));

      expect(mockNext).toHaveBeenCalled();
      expect((mockNext as jest.Mock).mock.calls[0][0].message).toBe('Authentication required');
      expect(TechnicianService.getReportsForTechnician).not.toHaveBeenCalled();
    });

    it('should throw error if user ID missing', async () => {
      (mockRequest as any).user = { role: 'TECHNICIAN' };

      await TechnicianController.getReportsForTechnician(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Wait for async operations to complete
      await new Promise(resolve => setImmediate(resolve));

      expect(mockNext).toHaveBeenCalled();
      expect((mockNext as jest.Mock).mock.calls[0][0].message).toBe('Authentication required');
      expect(TechnicianService.getReportsForTechnician).not.toHaveBeenCalled();
    });
  });

  describe('assignExternalOffice', () => {
    it('should assign external office successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { assignedExternalOfficeId: 5 };
      (mockRequest as any).user = { id: 5, role: 'TECHNICIAN' };

      (TechnicianService.assignExternalOffice as jest.Mock).mockResolvedValue(undefined);

      await TechnicianController.assignExternalOffice(mockRequest as Request, mockResponse as Response, mockNext);

      expect(TechnicianService.assignExternalOffice).toHaveBeenCalledWith(1, 5);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'Report assigned to external office',
      });
    });

    it('should remove external assignment successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { assignedExternalOfficeId: null };
      (mockRequest as any).user = { id: 5, role: 'TECHNICIAN' };

      (TechnicianService.assignExternalOffice as jest.Mock).mockResolvedValue(undefined);

      await TechnicianController.assignExternalOffice(mockRequest as Request, mockResponse as Response, mockNext);

      expect(TechnicianService.assignExternalOffice).toHaveBeenCalledWith(1, null);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        message: 'External assignment removed',
      });
    });

    it('should call next with error if report ID is invalid', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { assignedExternalOfficeId: 5 };

      await TechnicianController.assignExternalOffice(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid report ID',
        statusCode: 400,
      }));
    });

    it('should call next with error if user is not a technician', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { assignedExternalOfficeId: 5 };
      (mockRequest as any).user = { id: 5, role: 'OFFICER' };

      await TechnicianController.assignExternalOffice(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Only technicians can assign reports externally',
        statusCode: 403,
      }));
    });

    it('should call next with error if service fails', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { assignedExternalOfficeId: 5 };
      (mockRequest as any).user = { id: 5, role: 'TECHNICIAN' };

      (TechnicianService.assignExternalOffice as jest.Mock).mockRejectedValue(new Error('Service error'));

      await TechnicianController.assignExternalOffice(mockRequest as Request, mockResponse as Response, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setImmediate(resolve));

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Service error',
      }));
    });
  });
});
