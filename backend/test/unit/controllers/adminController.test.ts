import { Request, Response, NextFunction } from 'express';
import * as adminController from '../../../src/controllers/adminController';
import { adminService } from '../../../src/services/AdminService';

jest.mock('../../../src/services/AdminService');

describe('adminController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis() as any;
    mockNext = jest.fn();

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };
  });

  describe('setupUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'officer@example.com',
        username: 'officer1',
        role: 'OFFICER',
        name: 'Test',
        surname: 'Officer',
      };

      const mockUser = {
        id: 1,
        email: userData.email,
        username: userData.username,
        password: 'generatedPassword123',
      };

      mockRequest.body = userData;
      (adminService.createUser as jest.Mock).mockResolvedValue(mockUser);

      await adminController.setupUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(adminService.createUser).toHaveBeenCalledWith(userData);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          password: mockUser.password,
        },
      });
    });
  });

  describe('setupTechnician', () => {
    it('should create technician with category assignment', async () => {
      const technicianData = {
        email: 'tech@example.com',
        username: 'tech1',
        role: 'TECHNICIAN',
        name: 'Test',
        surname: 'Technician',
        category_id: '3',
      };

      const mockUser = {
        id: 1,
        email: technicianData.email,
        username: technicianData.username,
        password: 'generatedPassword123',
      };

      mockRequest.body = technicianData;
      (adminService.createUser as jest.Mock).mockResolvedValue(mockUser);
      (adminService.assignTechnicianCategory as jest.Mock).mockResolvedValue({
        user_id: 1,
        category_id: 3,
      });

      await adminController.setupTechnician(mockRequest as Request, mockResponse as Response, mockNext);

      expect(adminService.createUser).toHaveBeenCalledWith({
        email: technicianData.email,
        username: technicianData.username,
        role: 'TECHNICIAN',
        name: technicianData.name,
        surname: technicianData.surname,
      });
      expect(adminService.assignTechnicianCategory).toHaveBeenCalledWith(1, 3);
    });

    it('should create technician without category assignment', async () => {
      const technicianData = {
        email: 'tech@example.com',
        username: 'tech1',
        role: 'TECHNICIAN',
        name: 'Test',
        surname: 'Technician',
      };

      const mockUser = {
        id: 1,
        email: technicianData.email,
        username: technicianData.username,
        password: 'generatedPassword123',
      };

      mockRequest.body = technicianData;
      (adminService.createUser as jest.Mock).mockResolvedValue(mockUser);

      await adminController.setupTechnician(mockRequest as Request, mockResponse as Response, mockNext);

      expect(adminService.createUser).toHaveBeenCalled();
      expect(adminService.assignTechnicianCategory).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(201);
    });
  });

  describe('setTechnicianCategory', () => {
    it('should assign category to technician', async () => {
      const mockResult = {
        user_id: 1,
        category_id: 5,
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = { category_id: '5' };
      (adminService.assignTechnicianCategory as jest.Mock).mockResolvedValue(mockResult);

      await adminController.setTechnicianCategory(mockRequest as Request, mockResponse as Response, mockNext);

      expect(adminService.assignTechnicianCategory).toHaveBeenCalledWith(1, 5);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      });
    });
  });
});
