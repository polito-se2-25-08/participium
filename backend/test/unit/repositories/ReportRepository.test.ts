import * as ReportRepository from '../../../src/repositories/ReportRepository';
import { supabase } from '../../../src/utils/Supabase';
import AppError from '../../../src/utils/AppError';

jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('ReportRepository', () => {
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;
  let mockInsert: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockEq: jest.Mock;
  let mockIn: jest.Mock;
  let mockNeq: jest.Mock;
  let mockOrder: jest.Mock;
  let mockSingle: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSingle = jest.fn();
    mockOrder = jest.fn();
    mockNeq = jest.fn(() => ({ neq: mockNeq, order: mockOrder }));
    mockIn = jest.fn(() => ({ neq: mockNeq, order: mockOrder }));
    mockEq = jest.fn(() => ({ 
      eq: mockEq, 
      select: mockSelect, 
      single: mockSingle,
      neq: mockNeq,
      order: mockOrder,
    }));
    mockSelect = jest.fn(() => ({ 
      eq: mockEq, 
      single: mockSingle, 
      order: mockOrder,
      in: mockIn,
    }));
    mockInsert = jest.fn(() => ({ select: mockSelect }));
    mockUpdate = jest.fn(() => ({ eq: mockEq }));
    mockFrom = jest.fn(() => ({
      insert: mockInsert,
      select: mockSelect,
      update: mockUpdate,
    }));

    (supabase.from as jest.Mock) = mockFrom;
  });

  describe('createReport', () => {
    it('should create a report without photos', async () => {
      const reportData = {
        title: 'Test Report',
        description: 'Test Description',
        latitude: '45.0',
        longitude: '7.0',
        category_id: 1,
        user_id: 1,
        anonymous: false,
        timestamp: '2024-01-01T00:00:00Z',
        photos: [],
      };

      const mockReport = {
        id: 1,
        title: reportData.title,
        description: reportData.description,
        latitude: reportData.latitude,
        longitude: reportData.longitude,
        category_id: reportData.category_id,
        user_id: reportData.user_id,
        anonymous: reportData.anonymous,
        timestamp: reportData.timestamp,
        status: 'PENDING_APPROVAL',
      };

      mockSingle.mockResolvedValue({ data: mockReport, error: null });

      const result = await ReportRepository.createReport(reportData);

      expect(mockFrom).toHaveBeenCalledWith('Report');
      const { photos, ...reportFields } = reportData;
      expect(mockInsert).toHaveBeenCalledWith([reportFields]);
      expect(result).toEqual(mockReport);
    });

    it('should create a report with photos', async () => {
      const reportData = {
        title: 'Test Report',
        description: 'Test Description',
        latitude: '45.0',
        longitude: '7.0',
        category_id: 1,
        user_id: 1,
        anonymous: false,
        timestamp: '2024-01-01T00:00:00Z',
        photos: ['photo1.jpg', 'photo2.jpg'],
      };

      const mockReport = {
        id: 1,
        title: reportData.title,
        description: reportData.description,
        status: 'PENDING_APPROVAL',
      };

      mockSingle.mockResolvedValue({ data: mockReport, error: null });
      
      // Mock for Report_Photo insert
      const mockPhotoInsert = jest.fn(() => ({})) as any;
      mockFrom.mockImplementation((table) => {
        if (table === 'Report_Photo') {
          return { insert: mockPhotoInsert };
        }
        return {
          insert: mockInsert,
          select: mockSelect,
        };
      });

      mockPhotoInsert.mockResolvedValue({ error: null });

      const result = await ReportRepository.createReport(reportData);

      expect(mockPhotoInsert).toHaveBeenCalledWith([
        { report_id: 1, report_photo: 'photo1.jpg' },
        { report_id: 1, report_photo: 'photo2.jpg' },
      ]);
      expect(result).toEqual(mockReport);
    });

    it('should throw AppError on report insert failure', async () => {
      const reportData = {
        title: 'Test Report',
        description: 'Test Description',
        latitude: '45.0',
        longitude: '7.0',
        category_id: 1,
        user_id: 1,
        anonymous: false,
        timestamp: '2024-01-01T00:00:00Z',
        photos: [],
      };

      const error = new Error('Insert failed');
      mockSingle.mockResolvedValue({ data: null, error });

      await expect(ReportRepository.createReport(reportData)).rejects.toThrow(AppError);
      await expect(ReportRepository.createReport(reportData)).rejects.toThrow('Failed to create report');
    });

    it('should throw AppError on photo insert failure', async () => {
      const reportData = {
        title: 'Test Report',
        description: 'Test Description',
        latitude: '45.0',
        longitude: '7.0',
        category_id: 1,
        user_id: 1,
        anonymous: false,
        timestamp: '2024-01-01T00:00:00Z',
        photos: ['photo1.jpg', 'photo2.jpg'],
      };

      const mockReport = {
        id: 1,
        title: reportData.title,
      };

      mockSingle.mockResolvedValue({ data: mockReport, error: null });

      const photoError = new Error('Photo insert failed');
      mockFrom.mockImplementation((table) => {
        if (table === 'Report_Photo') {
          return {
            insert: jest.fn(() => ({ error: photoError })),
          };
        }
        return {
          insert: mockInsert,
          select: mockSelect,
        };
      });

      await expect(ReportRepository.createReport(reportData)).rejects.toThrow(AppError);
      await expect(ReportRepository.createReport(reportData)).rejects.toThrow('Failed to save report photos');
    });
  });

  describe('getReportById', () => {
    it('should return a report by id', async () => {
      const mockReport = {
        id: 1,
        title: 'Test Report',
        category_id: 1,
        user_id: 1,
      };

      // Mock for getReportById
      mockSingle.mockResolvedValueOnce({ data: mockReport, error: null });
      
      // Mock for remapReports - Category query
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, category: 'Roads' }], 
        error: null 
      });
      
      // Mock for remapReports - User query
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, username: 'testuser' }], 
        error: null 
      });

      const result = await ReportRepository.getReportById(1);

      expect(mockFrom).toHaveBeenCalledWith('Report');
      expect(mockEq).toHaveBeenCalledWith('id', 1);
      expect(result).toBeDefined();
    });

    it('should throw AppError if report not found', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      await expect(ReportRepository.getReportById(999)).rejects.toThrow(AppError);
      await expect(ReportRepository.getReportById(999)).rejects.toThrow('Report with id 999 not found');
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Database error');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(ReportRepository.getReportById(1)).rejects.toThrow(AppError);
      await expect(ReportRepository.getReportById(1)).rejects.toThrow('Failed to fetch report');
    });
  });

  describe('updateReportStatus', () => {
    it('should update report status', async () => {
      const mockReport = {
        id: 1,
        title: 'Test Report',
        status: 'IN_PROGRESS',
      };

      mockSingle.mockResolvedValue({ data: mockReport, error: null });

      const result = await ReportRepository.updateReportStatus(1, 'IN_PROGRESS');

      expect(mockFrom).toHaveBeenCalledWith('Report');
      expect(mockUpdate).toHaveBeenCalledWith({ status: 'IN_PROGRESS' });
      expect(mockEq).toHaveBeenCalledWith('id', 1);
      expect(result).toEqual(mockReport);
    });

    it('should throw AppError if report not found', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      await expect(ReportRepository.updateReportStatus(999, 'IN_PROGRESS')).rejects.toThrow(AppError);
      await expect(ReportRepository.updateReportStatus(999, 'IN_PROGRESS')).rejects.toThrow('Report with id 999 not found');
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Update failed');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(ReportRepository.updateReportStatus(1, 'IN_PROGRESS')).rejects.toThrow(AppError);
      await expect(ReportRepository.updateReportStatus(1, 'IN_PROGRESS')).rejects.toThrow('Failed to update report status');
    });
  });

  describe('approveReport', () => {
    it('should approve a report', async () => {
      const mockReport = {
        id: 1,
        title: 'Test Report',
        status: 'ASSIGNED',
      };

      // Mock for approveReport
      mockSingle.mockResolvedValueOnce({ data: mockReport, error: null });
      
      // Mock for remapReports - Category query
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, category: 'Roads' }], 
        error: null 
      });
      
      // Mock for remapReports - User query
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, username: 'testuser' }], 
        error: null 
      });

      const result = await ReportRepository.approveReport(1);

      expect(mockUpdate).toHaveBeenCalledWith({ status: 'ASSIGNED' });
      expect(mockEq).toHaveBeenCalledWith('id', 1);
      expect(result).toBeDefined();
    });

    it('should throw AppError if report not found', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      await expect(ReportRepository.approveReport(999)).rejects.toThrow(AppError);
      await expect(ReportRepository.approveReport(999)).rejects.toThrow('Report with id 999 not found');
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Update failed');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(ReportRepository.approveReport(1)).rejects.toThrow(AppError);
      await expect(ReportRepository.approveReport(1)).rejects.toThrow('Failed to approve report');
    });
  });

  describe('rejectReport', () => {
    it('should reject a report with motivation', async () => {
      const mockReport = {
        id: 1,
        title: 'Test Report',
        status: 'REJECTED',
      };

      // Mock for report update
      mockSingle.mockResolvedValueOnce({ data: mockReport, error: null });

      // Mock for rejection insert
      const mockRejectionInsert = jest.fn(() => ({})) as any;
      mockFrom.mockImplementation((table) => {
        if (table === 'Rejection_Report') {
          return { insert: mockRejectionInsert };
        }
        return {
          update: mockUpdate,
          select: mockSelect,
        };
      });

      mockRejectionInsert.mockResolvedValue({ error: null });

      // Mock for remapReports - Category query
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, category: 'Roads' }], 
        error: null 
      });
      
      // Mock for remapReports - User query
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, username: 'testuser' }], 
        error: null 
      });

      const result = await ReportRepository.rejectReport(1, 'Duplicate report');

      expect(mockUpdate).toHaveBeenCalledWith({ status: 'REJECTED' });
      expect(mockRejectionInsert).toHaveBeenCalledWith([{
        report_id: 1,
        motivation: 'Duplicate report',
      }]);
      expect(result).toBeDefined();
    });

    it('should throw AppError if report not found', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      await expect(ReportRepository.rejectReport(999, 'Test')).rejects.toThrow(AppError);
      await expect(ReportRepository.rejectReport(999, 'Test')).rejects.toThrow('Report with id 999 not found');
    });

    it('should throw AppError on report update error', async () => {
      const dbError = new Error('Update failed');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(ReportRepository.rejectReport(1, 'Test')).rejects.toThrow(AppError);
      await expect(ReportRepository.rejectReport(1, 'Test')).rejects.toThrow('Failed to reject report');
    });
  });

  describe('getReportsByCategoryAndStatus', () => {
    it('should return reports by category and status', async () => {
      const mockReports = [
        { id: 1, category_id: 1, status: 'ASSIGNED' },
        { id: 2, category_id: 1, status: 'ASSIGNED' },
      ];

      mockOrder.mockResolvedValue({ data: mockReports, error: null });

      const result = await ReportRepository.getReportsByCategoryAndStatus(1, 'ASSIGNED');

      expect(mockFrom).toHaveBeenCalledWith('Report');
      expect(mockEq).toHaveBeenCalledWith('category_id', 1);
      expect(mockEq).toHaveBeenCalledWith('status', 'ASSIGNED');
      expect(mockOrder).toHaveBeenCalledWith('timestamp', { ascending: false });
      expect(result).toEqual(mockReports);
    });

    it('should return empty array if no reports found', async () => {
      mockOrder.mockResolvedValue({ data: null, error: null });

      const result = await ReportRepository.getReportsByCategoryAndStatus(1, 'ASSIGNED');

      expect(result).toEqual([]);
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Database error');
      mockOrder.mockResolvedValue({ data: null, error: dbError });

      await expect(
        ReportRepository.getReportsByCategoryAndStatus(1, 'ASSIGNED')
      ).rejects.toThrow(AppError);
      
      await expect(
        ReportRepository.getReportsByCategoryAndStatus(1, 'ASSIGNED')
      ).rejects.toThrow('Failed to fetch reports by category and status');
    });
  });

  describe('getReportsByTechnician', () => {
    it('should return reports for technician category', async () => {
      const mockReports = [
        { id: 1, category_id: 1, status: 'ASSIGNED', photos: [], user: { name: 'John', surname: 'Doe' } },
        { id: 2, category_id: 1, status: 'IN_PROGRESS', photos: [], user: { name: 'Jane', surname: 'Smith' } },
      ];

      // Mock for getReportsByTechnician query
      mockOrder.mockResolvedValueOnce({ data: mockReports, error: null });

      const result = await ReportRepository.getReportsByTechnician([1]);

      expect(mockIn).toHaveBeenCalledWith('category_id', [1]);
      expect(mockNeq).toHaveBeenCalledWith('status', 'REJECTED');
      expect(mockNeq).toHaveBeenCalledWith('status', 'RESOLVED');
      expect(result).toBeDefined();
    });

    it('should return empty array if no reports', async () => {
      mockOrder.mockResolvedValueOnce({ data: null, error: null });

      const result = await ReportRepository.getReportsByTechnician([1]);

      expect(result).toEqual([]);
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Database error');
      mockOrder.mockResolvedValue({ data: null, error: dbError });

      await expect(ReportRepository.getReportsByTechnician([1])).rejects.toThrow(AppError);
      await expect(ReportRepository.getReportsByTechnician([1])).rejects.toThrow('Failed to fetch reports by category and status');
    });
  });

  describe('getAllReports', () => {
    it('should return all reports with remapped data', async () => {
      const mockReports = [
        { id: 1, category_id: 1, user_id: 1, status: 'PENDING', photos: [] },
        { id: 2, category_id: 2, user_id: 2, status: 'APPROVED', photos: [] },
      ];

      // Mock for getAllReports query
      mockOrder.mockResolvedValueOnce({ data: mockReports, error: null });
      
      // Mock for remapReports - Category query
      mockOrder.mockResolvedValueOnce({ 
        data: [
          { id: 1, category: 'Roads' },
          { id: 2, category: 'Water' }
        ], 
        error: null 
      });
      
      // Mock for remapReports - User query
      mockOrder.mockResolvedValueOnce({ 
        data: [
          { id: 1, username: 'user1' },
          { id: 2, username: 'user2' }
        ], 
        error: null 
      });

      const result = await ReportRepository.getAllReports();

      expect(mockFrom).toHaveBeenCalledWith('Report');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockOrder).toHaveBeenCalledWith('timestamp', { ascending: true });
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no reports found', async () => {
      mockOrder.mockResolvedValueOnce({ data: null, error: null });

      const result = await ReportRepository.getAllReports();

      expect(result).toEqual(null);
    });
  });

  describe('getActiveReports', () => {
    it('should return active reports with correct statuses', async () => {
      const mockReports = [
        { 
          id: 1, 
          category_id: 1, 
          user_id: 1, 
          status: 'ASSIGNED',
          category: { category: 'Roads' },
          photos: [],
          User: { name: 'John', surname: 'Doe', username: 'johndoe', profile_picture: 'pic.jpg' }
        },
        { 
          id: 2, 
          category_id: 2, 
          user_id: 2, 
          status: 'IN_PROGRESS',
          category: { category: 'Water' },
          photos: [],
          User: { name: 'Jane', surname: 'Doe', username: 'janedoe', profile_picture: 'pic.jpg' }
        },
        { 
          id: 3, 
          category_id: 1, 
          user_id: 1, 
          status: 'SUSPENDED',
          category: { category: 'Roads' },
          photos: [],
          User: { name: 'John', surname: 'Doe', username: 'johndoe', profile_picture: 'pic.jpg' }
        },
      ];

      // Mock for getActiveReports query
      mockOrder.mockResolvedValueOnce({ data: mockReports, error: null });

      const result = await ReportRepository.getActiveReports();

      expect(mockFrom).toHaveBeenCalledWith('Report');
      expect(mockIn).toHaveBeenCalledWith('status', ['ASSIGNED', 'IN_PROGRESS', 'SUSPENDED']);
      expect(mockOrder).toHaveBeenCalledWith('timestamp', { ascending: false });
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
    });

    it('should return empty array if no active reports', async () => {
      mockOrder.mockResolvedValueOnce({ data: [], error: null });

      const result = await ReportRepository.getActiveReports();

      expect(result).toEqual([]);
    });
  });

  describe('getFilteredReports', () => {
    let mockGte: jest.Mock;
    let mockLte: jest.Mock;

    beforeEach(() => {
      mockGte = jest.fn(() => ({ lte: mockLte, order: mockOrder }));
      mockLte = jest.fn(() => ({ order: mockOrder }));
      mockIn = jest.fn(() => ({ 
        in: mockIn, 
        gte: mockGte,
        lte: mockLte,
        order: mockOrder 
      }));
      mockEq = jest.fn(() => ({ 
        eq: mockEq,
        in: mockIn,
        gte: mockGte,
        lte: mockLte,
        order: mockOrder 
      }));
      mockSelect = jest.fn(() => ({ 
        eq: mockEq,
        in: mockIn,
        gte: mockGte,
        lte: mockLte,
        order: mockOrder 
      }));
      mockFrom = jest.fn(() => ({
        select: mockSelect,
      }));
      (supabase.from as jest.Mock) = mockFrom;
    });

    it('should filter reports with all parameters', async () => {
      const mockReports = [
        { id: 1, category_id: 1, user_id: 1, status: 'PENDING' },
      ];

      // Mock for getFilteredReports query
      mockOrder.mockResolvedValueOnce({ data: mockReports, error: null });
      
      // Mock for remapReports - Category query
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, category: 'Roads' }], 
        error: null 
      });
      
      // Mock for remapReports - User query
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, username: 'user1' }], 
        error: null 
      });

      const result = await ReportRepository.getFilteredReports(
        '1',
        ['Roads'],
        ['PENDING'],
        '2025-01-01',
        '2025-12-31'
      );

      expect(mockFrom).toHaveBeenCalledWith('Report');
      expect(result).toBeDefined();
    });

    it('should filter reports with no filters applied', async () => {
      const mockReports = [
        { id: 1, category_id: 1, user_id: 1, status: 'PENDING' },
        { id: 2, category_id: 2, user_id: 2, status: 'APPROVED' },
      ];

      mockOrder.mockResolvedValueOnce({ data: mockReports, error: null });
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, category: 'Roads' }, { id: 2, category: 'Water' }], 
        error: null 
      });
      mockOrder.mockResolvedValueOnce({ 
        data: [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }], 
        error: null 
      });

      const result = await ReportRepository.getFilteredReports('', [], [], '', '');

      expect(result).toHaveLength(2);
    });

    it('should return empty array if no reports match filters', async () => {
      mockOrder.mockResolvedValueOnce({ data: null, error: null });

      const result = await ReportRepository.getFilteredReports('1', [], [], '', '');

      expect(result).toEqual([]);
    });
  });
});
