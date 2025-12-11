import { MessageRepository } from '../../../src/repositories/MessageRepository';
import { supabase } from '../../../src/utils/Supabase';

jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('MessageRepository', () => {
  const mockSelect = jest.fn();
  const mockInsert = jest.fn();
  const mockEq = jest.fn();
  const mockOrder = jest.fn();
  const mockSingle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    });
    mockInsert.mockReturnValue({
      select: mockSelect,
    });
    mockSelect.mockReturnValue({
      single: mockSingle,
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      order: mockOrder,
    });
  });

  describe('saveMessage', () => {
    it('should save message', async () => {
      const mockData = { id: 1, message: 'Hello' };
      mockSingle.mockResolvedValue({ data: mockData, error: null });

      const result = await MessageRepository.saveMessage('Hello', 1, 1);

      expect(supabase.from).toHaveBeenCalledWith('Report_Message');
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hello',
        report_id: 1,
        sender_id: 1,
      }));
      expect(result).toEqual(mockData);
    });

    it('should throw error on DB error', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'DB Error' } });

      await expect(MessageRepository.saveMessage('Hello', 1, 1)).rejects.toThrow('DB Error');
    });
  });

  describe('getMessagesByReportId', () => {
    it('should return messages', async () => {
      const mockData = [{ id: 1, message: 'Hello' }];
      mockOrder.mockResolvedValue({ data: mockData, error: null });

      const result = await MessageRepository.getMessagesByReportId(1);

      expect(supabase.from).toHaveBeenCalledWith('Report_Message');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('report_id', 1);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: true });
      expect(result).toEqual(mockData);
    });

    it('should throw error on DB error', async () => {
      mockOrder.mockResolvedValue({ data: null, error: { message: 'DB Error' } });

      await expect(MessageRepository.getMessagesByReportId(1)).rejects.toThrow('DB Error');
    });
  });
});
