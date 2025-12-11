import { Request, Response } from 'express';
import * as ExternalCompanyController from '../../../src/controllers/externalCompanyController';
import { externalCompanyService } from '../../../src/services/ExternalCompanyService';
import AppError from '../../../src/utils/AppError';

jest.mock('../../../src/services/ExternalCompanyService');

describe('ExternalCompanyController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    req = {};
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    res = {
      status,
      json,
    };
    jest.clearAllMocks();
  });

  describe('getAllExternalCompanies', () => {
    it('should return all companies', async () => {
      const mockCompanies = [{ id: 1, name: 'Company A' }];
      (externalCompanyService.getAllCompanies as jest.Mock).mockResolvedValue(mockCompanies);

      await ExternalCompanyController.getAllExternalCompanies(req as Request, res as Response, jest.fn());

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        success: true,
        results: 1,
        data: mockCompanies,
      });
    });
  });

  describe('getExternalCompanyById', () => {
    it('should return company by id', async () => {
      req.params = { id: '1' };
      const mockCompany = { id: 1, name: 'Company A' };
      (externalCompanyService.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);

      await ExternalCompanyController.getExternalCompanyById(req as Request, res as Response, jest.fn());

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        success: true,
        data: mockCompany,
      });
    });

    it('should throw error if id is invalid', async () => {
      req.params = { id: 'abc' };
      const next = jest.fn();

      await ExternalCompanyController.getExternalCompanyById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('Invalid company ID');
    });
  });

  describe('getExternalCompaniesByCategory', () => {
    it('should return companies by category', async () => {
      req.params = { categoryId: '1' };
      const mockCompanies = [{ id: 1, name: 'Company A', category_id: 1 }];
      (externalCompanyService.getCompaniesByCategory as jest.Mock).mockResolvedValue(mockCompanies);

      await ExternalCompanyController.getExternalCompaniesByCategory(req as Request, res as Response, jest.fn());

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        success: true,
        results: 1,
        data: mockCompanies,
      });
    });

    it('should throw error if categoryId is invalid', async () => {
      req.params = { categoryId: 'abc' };
      const next = jest.fn();

      await ExternalCompanyController.getExternalCompaniesByCategory(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('Invalid category ID');
    });
  });
});
