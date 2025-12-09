import * as ReportMessageService from '../../../src/services/ReportMessageService';
import * as ReportMessageRepository from '../../../src/repositories/ReportMessageRepository';
import * as NotificationService from '../../../src/services/NotificationService';
import { io, connectedUsers } from '../../../src/app';

jest.mock('../../../src/repositories/ReportMessageRepository');
jest.mock('../../../src/services/NotificationService');
jest.mock('../../../src/app', () => ({
  io: {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  },
  connectedUsers: new Map(),
}));

describe('ReportMessageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (connectedUsers as Map<number, string>).clear();
    console.log = jest.fn();
  });

  describe('createMessage', () => {
    it('should create message and notification', async () => {
      const messageData = {
        report_id: 1,
        sender_id: 1,
        message: 'Test message',
      };

      const mockMessage = {
        id: 1,
        ...messageData,
        created_at: new Date().toISOString(),
      };

      const mockNotification = {
        id: 1,
        user_id: 2,
        report_id: 1,
        type: 'NEW_MESSAGE',
        message: 'New message on report #1',
      };

      (ReportMessageRepository.createMessage as jest.Mock).mockResolvedValue(mockMessage);
      (NotificationService.createNotification as jest.Mock).mockResolvedValue(mockNotification);

      const result = await ReportMessageService.createMessage(messageData, 2);

      expect(ReportMessageRepository.createMessage).toHaveBeenCalledWith(messageData);
      expect(NotificationService.createNotification).toHaveBeenCalledWith({
        user_id: 2,
        report_id: 1,
        type: 'NEW_MESSAGE',
        message: 'New message on report #1',
      });
      expect(result).toEqual(mockMessage);
    });

    it('should send WebSocket notification if user is online', async () => {
      const messageData = {
        report_id: 1,
        sender_id: 1,
        message: 'Test message',
      };

      const mockMessage = { id: 1, ...messageData };
      const mockNotification = {
        id: 1,
        user_id: 2,
        message: 'New message on report #1',
        created_at: '2024-01-01',
      };

      (ReportMessageRepository.createMessage as jest.Mock).mockResolvedValue(mockMessage);
      (NotificationService.createNotification as jest.Mock).mockResolvedValue(mockNotification);

      // Simulate user being online
      connectedUsers.set(2, 'socket-123');

      await ReportMessageService.createMessage(messageData, 2);

      expect(io.to).toHaveBeenCalledWith('socket-123');
      expect(io.emit).toHaveBeenCalledWith('notification', {
        id: 1,
        message: 'New message on report #1',
        reportId: 1,
        type: 'NEW_MESSAGE',
        timestamp: '2024-01-01',
      });
    });

    it('should not send WebSocket notification if user is offline', async () => {
      const messageData = {
        report_id: 1,
        sender_id: 1,
        message: 'Test message',
      };

      const mockMessage = { id: 1, ...messageData };
      const mockNotification = { id: 1, user_id: 2 };

      (ReportMessageRepository.createMessage as jest.Mock).mockResolvedValue(mockMessage);
      (NotificationService.createNotification as jest.Mock).mockResolvedValue(mockNotification);

      // User is not in connectedUsers map (offline)
      await ReportMessageService.createMessage(messageData, 2);

      expect(io.to).not.toHaveBeenCalled();
      expect(io.emit).not.toHaveBeenCalled();
    });

    it('should handle different report IDs', async () => {
      const reportIds = [1, 5, 10, 100];

      for (const reportId of reportIds) {
        const messageData = {
          report_id: reportId,
          sender_id: 1,
          message: 'Test message',
        };

        (ReportMessageRepository.createMessage as jest.Mock).mockResolvedValue({
          id: 1,
          ...messageData,
        });
        (NotificationService.createNotification as jest.Mock).mockResolvedValue({
          id: 1,
        });

        await ReportMessageService.createMessage(messageData, 2);

        expect(NotificationService.createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            report_id: reportId,
            message: `New message on report #${reportId}`,
          })
        );
      }
    });
  });

  describe('getMessagesByReportId', () => {
    it('should return messages for a report', async () => {
      const mockMessages = [
        { id: 1, report_id: 1, sender_id: 1, message: 'Message 1' },
        { id: 2, report_id: 1, sender_id: 2, message: 'Message 2' },
      ];

      (ReportMessageRepository.getMessagesByReportId as jest.Mock).mockResolvedValue(mockMessages);

      const result = await ReportMessageService.getMessagesByReportId(1);

      expect(ReportMessageRepository.getMessagesByReportId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMessages);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no messages', async () => {
      (ReportMessageRepository.getMessagesByReportId as jest.Mock).mockResolvedValue([]);

      const result = await ReportMessageService.getMessagesByReportId(1);

      expect(result).toEqual([]);
    });

    it('should handle different report IDs', async () => {
      const reportIds = [1, 5, 10];

      for (const reportId of reportIds) {
        (ReportMessageRepository.getMessagesByReportId as jest.Mock).mockResolvedValue([
          { id: 1, report_id: reportId, message: 'Test' },
        ]);

        const result = await ReportMessageService.getMessagesByReportId(reportId);
        expect(result[0].report_id).toBe(reportId);
      }
    });

    it('should handle repository errors', async () => {
      (ReportMessageRepository.getMessagesByReportId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        ReportMessageService.getMessagesByReportId(999)
      ).rejects.toThrow('Database error');
    });
  });
});
