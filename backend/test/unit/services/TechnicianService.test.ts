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

  describe('canTechnicianUpdateReport', () => {
    it('should return true if technician category matches report category', async () => {
      (TechnicianRepository.getTechnicianCategory as jest.Mock).mockResolvedValue(1);
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue({ id: 1, category_id: 1 });

      const result = await TechnicianService.canTechnicianUpdateReport(5, 1);

      expect(result).toBe(true);
    });

    it('should return false if technician category does not match report category', async () => {
      (TechnicianRepository.getTechnicianCategory as jest.Mock).mockResolvedValue(1);
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue({ id: 1, category_id: 2 });

      const result = await TechnicianService.canTechnicianUpdateReport(5, 1);

      expect(result).toBe(false);
    });

    it('should return false if error occurs', async () => {
      (TechnicianRepository.getTechnicianCategory as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const result = await TechnicianService.canTechnicianUpdateReport(5, 1);

      expect(result).toBe(false);
    });
  });

  describe('ensureReportNotExternallyAssigned', () => {
    it('should throw error if report not found', async () => {
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue(null);

      await expect(TechnicianService.ensureReportNotExternallyAssigned(1))
        .rejects.toThrow('Report not found');
    });

    it('should throw error if report is externally assigned', async () => {
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue({ id: 1, assignedExternalOfficeId: 5 });

      await expect(TechnicianService.ensureReportNotExternallyAssigned(1))
        .rejects.toThrow('This report is handled by an external office');
    });

    it('should not throw error if report is not externally assigned', async () => {
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue({ id: 1, assignedExternalOfficeId: null });

      await expect(TechnicianService.ensureReportNotExternallyAssigned(1))
        .resolves.not.toThrow();
    });
  });

  describe('assignExternalOffice', () => {
    it('should throw error if report not found', async () => {
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue(null);

      await expect(TechnicianService.assignExternalOffice(1, 5))
        .rejects.toThrow('Report not found');
    });

    it('should call updateReportExternalAssignment if report exists', async () => {
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue({ id: 1 });
      (TechnicianRepository.updateReportExternalAssignment as jest.Mock).mockResolvedValue(undefined);

      await TechnicianService.assignExternalOffice(1, 5);

      expect(TechnicianRepository.updateReportExternalAssignment).toHaveBeenCalledWith(1, 5);
    });
  });
});
