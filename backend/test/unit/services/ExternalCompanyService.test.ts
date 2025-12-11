import { externalCompanyService } from '../../../src/services/ExternalCompanyService';
import { externalCompanyRepository } from '../../../src/repositories/ExternalCompanyRepository';

jest.mock('../../../src/repositories/ExternalCompanyRepository');

describe('ExternalCompanyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCompanies', () => {
    it('should call repository.getAllCompanies', async () => {
      const mockData = [{ id: 1, name: 'Company A' }];
      (externalCompanyRepository.getAllCompanies as jest.Mock).mockResolvedValue(mockData);

      const result = await externalCompanyService.getAllCompanies();

      expect(externalCompanyRepository.getAllCompanies).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('getCompanyById', () => {
    it('should call repository.getCompanyById', async () => {
      const mockData = { id: 1, name: 'Company A' };
      (externalCompanyRepository.getCompanyById as jest.Mock).mockResolvedValue(mockData);

      const result = await externalCompanyService.getCompanyById(1);

      expect(externalCompanyRepository.getCompanyById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockData);
    });
  });

  describe('getCompaniesByCategory', () => {
    it('should call repository.getCompaniesByCategory', async () => {
      const mockData = [{ id: 1, name: 'Company A', category_id: 1 }];
      (externalCompanyRepository.getCompaniesByCategory as jest.Mock).mockResolvedValue(mockData);

      const result = await externalCompanyService.getCompaniesByCategory(1);

      expect(externalCompanyRepository.getCompaniesByCategory).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockData);
    });
  });
});
