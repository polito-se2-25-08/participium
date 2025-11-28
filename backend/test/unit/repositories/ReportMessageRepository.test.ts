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

  beforeEach(() => {
    jest.clearAllMocks();

    mockSingle = jest.fn();
    mockOrder = jest.fn();
    mockEq = jest.fn(() => ({ order: mockOrder }));
    mockSelect = jest.fn(() => ({ eq: mockEq, single: mockSingle }));
    mockInsert = jest.fn(() => ({ select: mockSelect }));
    mockFrom = jest.fn(() => ({
      insert: mockInsert,
      select: mockSelect,
    }));

    (supabase.from as jest.Mock) = mockFrom;
  });

  describe('createMessage', () => {
    it('should create a message', async () => {
      const messageData = {
        report_id: 1,
        sender_id: 1,
        message: 'Test message',
      };

      const mockMessage = {
        id: 1,
        ...messageData,
        created_at: '2024-01-01T00:00:00Z',
      };

      mockSingle.mockResolvedValue({ data: mockMessage, error: null });

      const result = await ReportMessageRepository.createMessage(messageData);

      expect(mockFrom).toHaveBeenCalledWith('Report_Message');
      expect(mockInsert).toHaveBeenCalledWith([messageData]);
      expect(result).toEqual(mockMessage);
    });

    it('should throw AppError on database error', async () => {
      const messageData = {
        report_id: 1,
        sender_id: 1,
        message: 'Test message',
      };

      const dbError = new Error('Insert failed');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(
        ReportMessageRepository.createMessage(messageData)
      ).rejects.toThrow(AppError);

      await expect(
        ReportMessageRepository.createMessage(messageData)
      ).rejects.toThrow('Failed to create message');
    });

    it('should handle different message data', async () => {
      const testCases = [
        { report_id: 1, sender_id: 1, message: 'Message 1' },
        { report_id: 2, sender_id: 5, message: 'Message 2' },
        { report_id: 10, sender_id: 3, message: 'Long message text here' },
      ];

      for (const messageData of testCases) {
        mockSingle.mockResolvedValue({
          data: { id: 1, ...messageData },
          error: null,
        });

        const result = await ReportMessageRepository.createMessage(messageData);
        expect(result.report_id).toBe(messageData.report_id);
        expect(result.sender_id).toBe(messageData.sender_id);
        expect(result.message).toBe(messageData.message);
      }
    });
  });

  describe('getMessagesByReportId', () => {
    it('should return messages for a report', async () => {
      const mockMessages = [
        {
          id: 1,
          report_id: 1,
          sender_id: 1,
          message: 'Message 1',
          sender: { id: 1, name: 'John', surname: 'Doe', username: 'john' },
        },
        {
          id: 2,
          report_id: 1,
          sender_id: 2,
          message: 'Message 2',
          sender: { id: 2, name: 'Jane', surname: 'Smith', username: 'jane' },
        },
      ];

      mockOrder.mockResolvedValue({ data: mockMessages, error: null });

      const result = await ReportMessageRepository.getMessagesByReportId(1);

      expect(mockFrom).toHaveBeenCalledWith('Report_Message');
      expect(mockSelect).toHaveBeenCalledWith(`
      *,
      sender:User(id, name, surname, username)
    `);
      expect(mockEq).toHaveBeenCalledWith('report_id', 1);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: true });
      expect(result).toEqual(mockMessages);
    });

    it('should return empty array if no messages', async () => {
      mockOrder.mockResolvedValue({ data: null, error: null });

      const result = await ReportMessageRepository.getMessagesByReportId(1);

      expect(result).toEqual([]);
    });

    it('should throw AppError on database error', async () => {
      const dbError = new Error('Database error');
      mockOrder.mockResolvedValue({ data: null, error: dbError });

      await expect(
        ReportMessageRepository.getMessagesByReportId(1)
      ).rejects.toThrow(AppError);

      await expect(
        ReportMessageRepository.getMessagesByReportId(1)
      ).rejects.toThrow('Failed to fetch messages');
    });

    it('should handle different report IDs', async () => {
      const reportIds = [1, 5, 10];

      for (const reportId of reportIds) {
        mockOrder.mockResolvedValue({
          data: [{ id: 1, report_id: reportId, message: 'Test' }],
          error: null,
        });

        const result = await ReportMessageRepository.getMessagesByReportId(reportId);
        expect(mockEq).toHaveBeenCalledWith('report_id', reportId);
        expect(result[0].report_id).toBe(reportId);
      }
    });

    it('should order messages by created_at ascending', async () => {
      mockOrder.mockResolvedValue({ data: [], error: null });

      await ReportMessageRepository.getMessagesByReportId(1);

      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: true });
    });
  });
});
