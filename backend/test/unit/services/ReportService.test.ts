import * as ReportService from '../../../src/services/ReportService';
import * as ReportRepository from '../../../src/repositories/ReportRepository';
import * as NotificationService from '../../../src/services/NotificationService';

jest.mock('../../../src/repositories/ReportRepository');
jest.mock('../../../src/services/NotificationService');

describe('ReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReport', () => {
    it('should create a report with photos', async () => {
      const reportData = {
        title: 'Test Report',
        description: 'Test Description',
        latitude: '45.0',
        longitude: '7.0',
        category_id: 1,
        user_id: 1,
        anonymous: false,
        timestamp: new Date().toISOString(),
        photos: ['photo1', 'photo2'],
      };

      const mockReport = { id: 1, ...reportData };
      (ReportRepository.createReport as jest.Mock).mockResolvedValue(mockReport);

      const result = await ReportService.createReport(reportData);

      expect(ReportRepository.createReport).toHaveBeenCalledWith(reportData);
      expect(result).toEqual(mockReport);
    });
  });

  describe('getAllReports', () => {
    it('should return all reports', async () => {
      const baseUser = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        username: 'jdoe',
        profile_picture: null,
      };

      const baseCategory = { id: 1, name: 'Category 1' };

      const mockReports = [
        {
          id: 1,
          title: 'Report 1',
          description: 'Desc 1',
          latitude: '45.0',
          longitude: '7.0',
          timestamp: new Date().toISOString(),
          anonymous: false,
          status: 'ASSIGNED',
          category: baseCategory,
          user: baseUser,
          photos: [],
          report_message: [],
          assignedExternalOfficeId: null,
        },
        {
          id: 2,
          title: 'Report 2',
          description: 'Desc 2',
          latitude: '45.1',
          longitude: '7.1',
          timestamp: new Date().toISOString(),
          anonymous: true,
          status: 'IN_PROGRESS',
          category: baseCategory,
          user: baseUser,
          photos: [],
          report_message: [],
          assignedExternalOfficeId: null,
        },
      ];

      (ReportRepository.getAllReports as jest.Mock).mockResolvedValue(mockReports);

      const result = await ReportService.getAllReports();

      expect(ReportRepository.getAllReports).toHaveBeenCalledWith();
      expect(result).toEqual([
        {
          id: 1,
          title: 'Report 1',
          description: 'Desc 1',
          latitude: '45.0',
          longitude: '7.0',
          timestamp: mockReports[0].timestamp,
          anonymous: false,
          status: 'ASSIGNED',
          category: baseCategory,
          user: {
            id: 1,
            name: 'John',
            surname: 'Doe',
            username: 'jdoe',
            profilePicture: null,
          },
          photos: [],
          internalMessages: [],
          publicMessages: [],
          assignedExternalOfficeId: null,
        },
        {
          id: 2,
          title: 'Report 2',
          description: 'Desc 2',
          latitude: '45.1',
          longitude: '7.1',
          timestamp: mockReports[1].timestamp,
          anonymous: true,
          status: 'IN_PROGRESS',
          category: baseCategory,
          user: {
            id: 1,
            name: 'John',
            surname: 'Doe',
            username: 'jdoe',
            profilePicture: null,
          },
          photos: [],
          internalMessages: [],
          publicMessages: [],
          assignedExternalOfficeId: null,
        },
      ]);
    });
  });

  describe('getReportById', () => {
    it('should return report by id', async () => {
      const mockReport = { id: 1, title: 'Test Report' };

      (ReportRepository.getReportById as jest.Mock).mockResolvedValue(mockReport);

      const result = await ReportService.getReportById(1);

      expect(ReportRepository.getReportById).toHaveBeenCalledWith(1, 'CITIZEN');
      expect(result).toEqual(mockReport);
    });
  });

  describe('getActiveReports', () => {
    it('should return active reports', async () => {
      const mockReports = [
        { id: 1, status: 'PENDING_APPROVAL' },
        { id: 2, status: 'ASSIGNED' },
      ];

      (ReportRepository.getActiveReports as jest.Mock).mockResolvedValue(mockReports);

      const result = await ReportService.getActiveReports();

      expect(ReportRepository.getActiveReports).toHaveBeenCalledWith('CITIZEN');
      expect(result).toEqual(mockReports);
    });
  });

  describe('getFilteredReports', () => {
    it('should return filtered reports', async () => {
      const filters = {
        userId: '1',
        category: ['water_supply'],
        status: ['PENDING_APPROVAL'],
        reportsFrom: '2024-01-01',
        reportsUntil: '2024-12-31',
      };

      const mockReports = [{ id: 1, title: 'Filtered Report' }];

      (ReportRepository.getFilteredReports as jest.Mock).mockResolvedValue(mockReports);

      const result = await ReportService.getFilteredReports(
        filters.userId,
        filters.category,
        filters.status,
        filters.reportsFrom,
        filters.reportsUntil
      );

      expect(ReportRepository.getFilteredReports).toHaveBeenCalledWith(
        filters.userId,
        filters.category,
        filters.status,
        filters.reportsFrom,
        filters.reportsUntil,
        'CITIZEN'
      );
      expect(result).toEqual(mockReports);
    });
  });

  describe('approveReport', () => {
    it('should approve a report', async () => {
      const mockReport = { id: 1, status: 'ASSIGNED' };

      (ReportRepository.approveReport as jest.Mock).mockResolvedValue(mockReport);

      const result = await ReportService.approveReport(1);

      expect(ReportRepository.approveReport).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockReport);
    });
  });

  describe('rejectReport', () => {
    it('should reject a report with motivation', async () => {
      const mockReport = { id: 1, status: 'REJECTED' };

      (ReportRepository.rejectReport as jest.Mock).mockResolvedValue(mockReport);

      const result = await ReportService.rejectReport(1, 'Invalid report', 1);

      expect(ReportRepository.rejectReport).toHaveBeenCalledWith(1, 'Invalid report');
      expect(result).toEqual(mockReport);
    });
  });

  describe('updateReportStatus', () => {
    it('should update report status and create notification', async () => {
      const mockReport = { id: 1, status: 'IN_PROGRESS' };

      (ReportRepository.updateReportStatus as jest.Mock).mockResolvedValue(mockReport);
      (NotificationService.createNotification as jest.Mock).mockResolvedValue({});

      const result = await ReportService.updateReportStatus(1, 'IN_PROGRESS', 2);

      expect(ReportRepository.updateReportStatus).toHaveBeenCalledWith(1, 'IN_PROGRESS');
      expect(NotificationService.createNotification).toHaveBeenCalledWith({
        user_id: 2,
        report_id: 1,
        type: 'STATUS_UPDATE',
        message: 'Your report #1 status has been updated to: IN_PROGRESS',
      });
      expect(result).toEqual(mockReport);
    });
  });
});
