import * as TechnicianRepository from '../../../src/repositories/TechnicianRepository';
import { supabase } from '../../../src/utils/Supabase';
import AppError from '../../../src/utils/AppError';

jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('TechnicianRepository', () => {
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;
  let mockEq: jest.Mock;
  let mockLimit: jest.Mock;
  let mockSingle: jest.Mock;
  let mockUpsert: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSingle = jest.fn();
    mockLimit = jest.fn(() => ({ single: mockSingle }));
    mockEq = jest.fn(() => ({ limit: mockLimit }));
    mockSelect = jest.fn(() => ({ eq: mockEq }));
    mockUpsert = jest.fn();
    mockFrom = jest.fn(() => ({
      select: mockSelect,
      upsert: mockUpsert,
    }));

    (supabase.from as jest.Mock) = mockFrom;
  });

  describe('getTechnicianCategory', () => {
    it('should return technician category', async () => {
      const mockData = { category_id: 3 };

      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await TechnicianRepository.getTechnicianCategory(1);

      expect(mockFrom).toHaveBeenCalledWith('Technician_Category');
      expect(mockSelect).toHaveBeenCalledWith('category_id');
      expect(mockEq).toHaveBeenCalledWith('user_id', 1);
      expect(mockLimit).toHaveBeenCalledWith(1);
      expect(result).toBe(3);
    });

    it('should throw AppError if technician not found', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      await expect(
        TechnicianRepository.getTechnicianCategory(999)
      ).rejects.toThrow(AppError);

      await expect(
        TechnicianRepository.getTechnicianCategory(999)
      ).rejects.toThrow('Technician with user_id 999 not found');
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Database error');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(
        TechnicianRepository.getTechnicianCategory(1)
      ).rejects.toThrow(AppError);

      await expect(
        TechnicianRepository.getTechnicianCategory(1)
      ).rejects.toThrow('Failed to fetch technician category');
    });

    it('should handle different user IDs', async () => {
      const userIds = [1, 5, 10, 100];
      const categoryIds = [1, 3, 5, 9];

      for (let i = 0; i < userIds.length; i++) {
        mockSingle.mockResolvedValue({ 
          data: { category_id: categoryIds[i] }, 
          error: null 
        });

        const result = await TechnicianRepository.getTechnicianCategory(userIds[i]);
        expect(result).toBe(categoryIds[i]);
      }
    });
  });

  describe('upsertTechnicianCategories', () => {
    it('should upsert technician categories', async () => {
      mockUpsert.mockResolvedValue({ error: null });

      await TechnicianRepository.upsertTechnicianCategories(1, [3]);

      expect(mockFrom).toHaveBeenCalledWith('Technician_Category');
      expect(mockUpsert).toHaveBeenCalledWith([{ user_id: 1, category_id: 3 }]);
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Upsert failed');
      mockUpsert.mockResolvedValue({ error: dbError });

      await expect(
        TechnicianRepository.upsertTechnicianCategories(1, [3])
      ).rejects.toThrow(AppError);

      await expect(
        TechnicianRepository.upsertTechnicianCategories(1, [3])
      ).rejects.toThrow('Failed to upsert technician categories');
    });

    it('should handle different user and category combinations', async () => {
      const testCases = [
        { user_id: 1, category_id: 1 },
        { user_id: 5, category_id: 3 },
        { user_id: 10, category_id: 9 },
      ];

      for (const testCase of testCases) {
        mockUpsert.mockResolvedValue({ error: null });

        await TechnicianRepository.upsertTechnicianCategories(testCase.user_id, [testCase.category_id]);

        expect(mockUpsert).toHaveBeenCalledWith([
          { user_id: testCase.user_id, category_id: testCase.category_id },
        ]);
      }
    });

    it('should handle category update for existing technician', async () => {
      mockUpsert.mockResolvedValue({ error: null });

      await TechnicianRepository.upsertTechnicianCategories(1, [3]);
      await TechnicianRepository.upsertTechnicianCategories(1, [5]);

      expect(mockUpsert).toHaveBeenCalledTimes(2);
      expect(mockUpsert).toHaveBeenLastCalledWith([{ user_id: 1, category_id: 5 }]);
    });
  });
});
