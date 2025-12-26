import * as ReportMessageService from '../../../src/services/ReportMessageService';
import * as ReportMessageRepository from '../../../src/repositories/ReportMessageRepository';
import * as ReportRepository from '../../../src/repositories/ReportRepository';

jest.mock('../../../src/repositories/ReportMessageRepository');
jest.mock('../../../src/repositories/ReportRepository');

describe('ReportMessageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPublicMessage', () => {
    it('should reject empty messages (after trim)', async () => {
      await expect(
        ReportMessageService.createPublicMessage(1, 1, '   ')
      ).rejects.toThrow('Message cannot be empty');
    });

    it('should reject if report not found', async () => {
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue(null);

      await expect(
        ReportMessageService.createPublicMessage(1, 1, 'hello')
      ).rejects.toThrow('Report not found');
    });

    it('should create a public message and return DTO in camelCase', async () => {
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue({ id: 1 });

      const saved = {
        id: 10,
        report_id: 1,
        sender_id: 2,
        message: 'hello',
        created_at: '2024-01-01T00:00:00Z',
        is_public: true,
      };

      (ReportMessageRepository.createPublicMessage as jest.Mock).mockResolvedValue(saved);

      const result = await ReportMessageService.createPublicMessage(1, 2, '  hello  ');

      expect(ReportMessageRepository.createPublicMessage).toHaveBeenCalledWith(1, 2, 'hello');
      expect(result).toEqual({
        id: 10,
        reportId: 1,
        senderId: 2,
        message: 'hello',
        createdAt: '2024-01-01T00:00:00Z',
        isPublic: true,
      });
    });
  });

  describe('createInternalMessage', () => {
    it('should reject empty messages (after trim)', async () => {
      await expect(
        ReportMessageService.createInternalMessage(1, 1, '   ')
      ).rejects.toThrow('Message cannot be empty');
    });

    it('should reject if report not found', async () => {
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue(null);

      await expect(
        ReportMessageService.createInternalMessage(1, 1, 'hello')
      ).rejects.toThrow('Report not found');
    });

    it('should create an internal message and return the saved entity', async () => {
      (ReportRepository.getReportById as jest.Mock).mockResolvedValue({ id: 1 });

      const saved = {
        id: 11,
        report_id: 1,
        sender_id: 2,
        message: 'hello',
        created_at: '2024-01-01T00:00:00Z',
        is_public: false,
      };

      (ReportMessageRepository.createInternalMessage as jest.Mock).mockResolvedValue(saved);

      const result = await ReportMessageService.createInternalMessage(1, 2, '  hello  ');

      expect(ReportMessageRepository.createInternalMessage).toHaveBeenCalledWith(1, 2, 'hello');
      expect(result).toEqual(saved);
    });
  });
});
