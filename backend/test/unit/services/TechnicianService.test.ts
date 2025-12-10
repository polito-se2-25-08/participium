import * as TechnicianService from '../../../src/services/TechnicianService';
import * as ReportRepository from '../../../src/repositories/ReportRepository';
import * as TechnicianRepository from '../../../src/repositories/TechnicianRepository';

jest.mock('../../../src/repositories/ReportRepository');
jest.mock('../../../src/repositories/TechnicianRepository');

describe('TechnicianService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getReportsForTechnician', () => {
    it('should return reports for technician based on their category', async () => {
      const mockReports = [
        { id: 1, category_id: 1, status: 'ASSIGNED' },
        { id: 2, category_id: 1, status: 'IN_PROGRESS' },
      ];

      (TechnicianRepository.getTechnicianCategory as jest.Mock).mockResolvedValue(1);
      (ReportRepository.getReportsByTechnician as jest.Mock).mockResolvedValue(mockReports);

      const result = await TechnicianService.getReportsForTechnician(5);

      expect(TechnicianRepository.getTechnicianCategory).toHaveBeenCalledWith(5);
      expect(ReportRepository.getReportsByTechnician).toHaveBeenCalledWith(
        1,
        ['ASSIGNED', 'IN_PROGRESS', 'SUSPENDED']
      );
      expect(result).toEqual(mockReports);
      expect(result).toHaveLength(2);
    });

    it('should filter reports by ASSIGNED, IN_PROGRESS, and SUSPENDED status', async () => {
      (TechnicianRepository.getTechnicianCategory as jest.Mock).mockResolvedValue(3);
      (ReportRepository.getReportsByTechnician as jest.Mock).mockResolvedValue([]);

      await TechnicianService.getReportsForTechnician(10);

      expect(ReportRepository.getReportsByTechnician).toHaveBeenCalledWith(
        3,
        expect.arrayContaining(['ASSIGNED', 'IN_PROGRESS', 'SUSPENDED'])
      );
    });

    it('should handle technicians with different categories', async () => {
      for (let categoryId = 1; categoryId <= 9; categoryId++) {
        (TechnicianRepository.getTechnicianCategory as jest.Mock).mockResolvedValue(categoryId);
        (ReportRepository.getReportsByTechnician as jest.Mock).mockResolvedValue([
          { id: categoryId, category_id: categoryId, status: 'ASSIGNED' },
        ]);

        const result = await TechnicianService.getReportsForTechnician(categoryId);

        expect(TechnicianRepository.getTechnicianCategory).toHaveBeenCalledWith(categoryId);
        expect(ReportRepository.getReportsByTechnician).toHaveBeenCalledWith(
          categoryId,
          expect.any(Array)
        );
        expect(result).toHaveLength(1);
      }
    });

    it('should return empty array if no reports for category', async () => {
      (TechnicianRepository.getTechnicianCategory as jest.Mock).mockResolvedValue(5);
      (ReportRepository.getReportsByTechnician as jest.Mock).mockResolvedValue([]);

      const result = await TechnicianService.getReportsForTechnician(1);

      expect(result).toEqual([]);
    });

    it('should handle repository errors when getting technician category', async () => {
      (TechnicianRepository.getTechnicianCategory as jest.Mock).mockRejectedValue(
        new Error('Technician not found')
      );
      (TechnicianRepository.getExternalMaintainerCategory as jest.Mock).mockRejectedValue(
        new Error('Technician not found')
      );

      await expect(
        TechnicianService.getReportsForTechnician(999)
      ).rejects.toThrow('Technician not found');
    });

    it('should handle repository errors when getting reports', async () => {
      (TechnicianRepository.getTechnicianCategory as jest.Mock).mockResolvedValue(1);
      (ReportRepository.getReportsByTechnician as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        TechnicianService.getReportsForTechnician(1)
      ).rejects.toThrow('Database error');
    });

    it('should not filter by optional status parameter (uses default statuses)', async () => {
      (TechnicianRepository.getTechnicianCategory as jest.Mock).mockResolvedValue(2);
      (ReportRepository.getReportsByTechnician as jest.Mock).mockResolvedValue([]);

      // Even if status filter is provided, it should use default statuses
      await TechnicianService.getReportsForTechnician(1, 'RESOLVED' as any);

      expect(ReportRepository.getReportsByTechnician).toHaveBeenCalledWith(
        2,
        ['ASSIGNED', 'IN_PROGRESS', 'SUSPENDED']
      );
    });
  });
});
