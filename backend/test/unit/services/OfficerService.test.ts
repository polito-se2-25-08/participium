import * as OfficerService from '../../../src/services/OfficerService';
import * as ReportRepository from '../../../src/repositories/ReportRepository';

jest.mock('../../../src/repositories/ReportRepository');

describe('OfficerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllReports', () => {
    it('should return all reports', async () => {
      const mockReports = [
        { id: 1, title: 'Report 1', status: 'PENDING_APPROVAL' },
        { id: 2, title: 'Report 2', status: 'ASSIGNED' },
      ];

      (ReportRepository.getAllReports as jest.Mock).mockResolvedValue(mockReports);

      const result = await OfficerService.getAllReports();

      expect(ReportRepository.getAllReports).toHaveBeenCalled();
      expect(result).toEqual(mockReports);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no reports', async () => {
      (ReportRepository.getAllReports as jest.Mock).mockResolvedValue([]);

      const result = await OfficerService.getAllReports();

      expect(result).toEqual([]);
    });
  });

  describe('updateReportStatus', () => {
    it('should update report status', async () => {
      const mockReport = { id: 1, status: 'IN_PROGRESS' };

      (ReportRepository.updateReportStatus as jest.Mock).mockResolvedValue(mockReport);

      const result = await OfficerService.updateReportStatus(1, 'IN_PROGRESS');

      expect(ReportRepository.updateReportStatus).toHaveBeenCalledWith(1, 'IN_PROGRESS');
      expect(result).toEqual(mockReport);
    });

    it('should handle different status values', async () => {
      const statuses = ['PENDING_APPROVAL', 'ASSIGNED', 'IN_PROGRESS', 'SUSPENDED', 'REJECTED', 'RESOLVED'];

      for (const status of statuses) {
        (ReportRepository.updateReportStatus as jest.Mock).mockResolvedValue({
          id: 1,
          status,
        });

        const result = await OfficerService.updateReportStatus(1, status);
        expect(result.status).toBe(status);
      }
    });
  });

  describe('getReportById', () => {
    it('should return report by id', async () => {
      const mockReport = {
        id: 1,
        title: 'Test Report',
        description: 'Test Description',
        status: 'PENDING_APPROVAL',
      };

      (ReportRepository.getReportById as jest.Mock).mockResolvedValue(mockReport);

      const result = await OfficerService.getReportById(1);

      expect(ReportRepository.getReportById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockReport);
    });

    it('should handle repository errors', async () => {
      (ReportRepository.getReportById as jest.Mock).mockRejectedValue(
        new Error('Report not found')
      );

      await expect(OfficerService.getReportById(999)).rejects.toThrow('Report not found');
    });
  });

  describe('approveReport', () => {
    it('should approve a report', async () => {
      const mockReport = {
        id: 1,
        title: 'Test Report',
        status: 'ASSIGNED',
      };

      (ReportRepository.approveReport as jest.Mock).mockResolvedValue(mockReport);

      const result = await OfficerService.approveReport(1);

      expect(ReportRepository.approveReport).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockReport);
      expect(result.status).toBe('ASSIGNED');
    });
  });

  describe('rejectReport', () => {
    it('should reject a report with motivation', async () => {
      const mockReport = {
        id: 1,
        title: 'Test Report',
        status: 'REJECTED',
      };

      (ReportRepository.rejectReport as jest.Mock).mockResolvedValue(mockReport);

      const result = await OfficerService.rejectReport(1, 'Duplicate report');

      expect(ReportRepository.rejectReport).toHaveBeenCalledWith(1, 'Duplicate report');
      expect(result).toEqual(mockReport);
      expect(result.status).toBe('REJECTED');
    });

    it('should handle different rejection motivations', async () => {
      const motivations = [
        'Duplicate report',
        'Insufficient information',
        'Out of jurisdiction',
        'Not a valid issue',
      ];

      for (const motivation of motivations) {
        (ReportRepository.rejectReport as jest.Mock).mockResolvedValue({
          id: 1,
          status: 'REJECTED',
        });

        await OfficerService.rejectReport(1, motivation);
        expect(ReportRepository.rejectReport).toHaveBeenCalledWith(1, motivation);
      }
    });

    it('should handle empty motivation', async () => {
      (ReportRepository.rejectReport as jest.Mock).mockResolvedValue({
        id: 1,
        status: 'REJECTED',
      });

      await OfficerService.rejectReport(1, '');
      expect(ReportRepository.rejectReport).toHaveBeenCalledWith(1, '');
    });
  });
});
