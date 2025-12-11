import { externalCompanyRepository } from '../../../src/repositories/ExternalCompanyRepository';
import { supabase } from '../../../src/utils/Supabase';
import AppError from '../../../src/utils/AppError';

jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('ExternalCompanyRepository', () => {
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
      single: mockSingle,
    });
    mockEq.mockReturnValue({
      single: mockSingle,
    });
  });

  describe('getAllCompanies', () => {
    it('should return all companies', async () => {
      const mockData = [{ id: 1, name: 'Company A' }];
      mockSelect.mockResolvedValue({ data: mockData, error: null });

      const result = await externalCompanyRepository.getAllCompanies();

      expect(supabase.from).toHaveBeenCalledWith('External_Company');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockData);
    });

    it('should throw AppError on DB error', async () => {
      mockSelect.mockResolvedValue({ data: null, error: { message: 'DB Error' } });

      await expect(externalCompanyRepository.getAllCompanies()).rejects.toThrow(AppError);
    });
  });

  describe('getCompanyById', () => {
    it('should return company by id', async () => {
      const mockData = { id: 1, name: 'Company A' };
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        single: mockSingle,
      });
      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await externalCompanyRepository.getCompanyById(1);

      expect(supabase.from).toHaveBeenCalledWith('External_Company');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 1);
      expect(result).toEqual(mockData);
    });

    it('should throw AppError if company not found', async () => {
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        single: mockSingle,
      });
      mockSingle.mockResolvedValue({ data: null, error: { message: 'Not found' } });

      await expect(externalCompanyRepository.getCompanyById(1)).rejects.toThrow(AppError);
    });
  });

  describe('getCompaniesByCategory', () => {
    it('should return companies by category', async () => {
      const mockData = [{ id: 1, name: 'Company A', category_id: 1 }];
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockResolvedValue({ data: mockData, error: null });

      const result = await externalCompanyRepository.getCompaniesByCategory(1);

      expect(supabase.from).toHaveBeenCalledWith('External_Company');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('category_id', 1);
      expect(result).toEqual(mockData);
    });

    it('should throw AppError on DB error', async () => {
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockResolvedValue({ data: null, error: { message: 'DB Error' } });

      await expect(externalCompanyRepository.getCompaniesByCategory(1)).rejects.toThrow(AppError);
    });
  });
});
