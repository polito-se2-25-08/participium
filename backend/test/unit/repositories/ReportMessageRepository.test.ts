import * as ReportMessageRepository from '../../../src/repositories/ReportMessageRepository';
import { supabase } from '../../../src/utils/Supabase';
import AppError from '../../../src/utils/AppError';

jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('ReportMessageRepository', () => {
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;
  let mockInsert: jest.Mock;
  let mockEq: jest.Mock;
  let mockOrder: jest.Mock;
  let mockSingle: jest.Mock;
  let mockInsertSelect: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSingle = jest.fn();
    mockOrder = jest.fn();
    mockEq = jest.fn(() => ({ eq: mockEq, order: mockOrder }));
    mockSelect = jest.fn(() => ({ eq: mockEq }));
    mockInsertSelect = jest.fn(() => ({ single: mockSingle }));
    mockInsert = jest.fn(() => ({ select: mockInsertSelect }));
    mockFrom = jest.fn(() => ({
      insert: mockInsert,
      select: mockSelect,
    }));

    (supabase.from as jest.Mock) = mockFrom;
  });

  describe('createPublicMessage', () => {
    it('should create a public message', async () => {
      const mockMessage = {
        id: 1,
        report_id: 1,
        sender_id: 1,
        message: 'Test message',
        is_public: true,
        created_at: '2024-01-01T00:00:00Z',
      };

      mockSingle.mockResolvedValue({ data: mockMessage, error: null });

      const result = await ReportMessageRepository.createPublicMessage(1, 1, 'Test message');

      expect(mockFrom).toHaveBeenCalledWith('Report_Message');
      expect(mockInsert).toHaveBeenCalledWith({
        report_id: 1,
        sender_id: 1,
        message: 'Test message',
        is_public: true,
      });
      expect(result).toEqual(mockMessage);
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Insert failed');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(
        ReportMessageRepository.createPublicMessage(1, 1, 'Test message')
      ).rejects.toThrow(AppError);

      await expect(
        ReportMessageRepository.createPublicMessage(1, 1, 'Test message')
      ).rejects.toThrow('Failed to create message');
    });
  });

  describe('getPublicMessagesByReportId', () => {
    it('should return public messages for a report', async () => {
      const mockMessages = [
        { id: 1, report_id: 1, sender_id: 1, message: 'Message 1', is_public: true },
        { id: 2, report_id: 1, sender_id: 2, message: 'Message 2', is_public: true },
      ];

      mockOrder.mockResolvedValue({ data: mockMessages, error: null });

      const result = await ReportMessageRepository.getPublicMessagesByReportId(1);

      expect(mockFrom).toHaveBeenCalledWith('Report_Message');
      expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining('*'));
      expect(mockEq).toHaveBeenCalledWith('report_id', 1);
      expect(mockEq).toHaveBeenCalledWith('is_public', true);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: true });
      expect(result).toEqual(mockMessages);
    });
  });
});
