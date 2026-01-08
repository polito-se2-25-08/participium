import { sendNotification } from '../../../src/utils/notificationHelper';
import * as NotificationService from '../../../src/services/NotificationService';
import { getIO, connectedUsers } from '../../../src/socket';

jest.mock('../../../src/services/NotificationService', () => ({
  createNotification: jest.fn(),
}));

jest.mock('../../../src/socket', () => ({
  getIO: jest.fn(),
  connectedUsers: {
    get: jest.fn(),
  },
}));

describe('notificationHelper', () => {
  let mockEmit: jest.Mock;
  let mockTo: jest.Mock;
  let mockIO: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit = jest.fn();
    mockTo = jest.fn(() => ({ emit: mockEmit }));
    mockIO = { to: mockTo };
    (getIO as jest.Mock).mockReturnValue(mockIO);
  });

  it('should save notification to DB and send via socket if user is online', async () => {
    (connectedUsers.get as jest.Mock).mockReturnValue('socket-123');
    (NotificationService.createNotification as jest.Mock).mockResolvedValue(true);

    const payload = {
      userId: 1,
      reportId: 10,
      type: 'TEST',
      message: 'Hello',
      additionalData: { foo: 'bar' },
    };

    await sendNotification(payload);

    expect(NotificationService.createNotification).toHaveBeenCalledWith(
      1, 10, 'TEST', 'Hello'
    );
    expect(connectedUsers.get).toHaveBeenCalledWith(1);
    expect(getIO).toHaveBeenCalled();
    expect(mockTo).toHaveBeenCalledWith('socket-123');
    expect(mockEmit).toHaveBeenCalledWith('notification', expect.objectContaining({
      type: 'TEST',
      message: 'Hello',
      reportId: 10,
      foo: 'bar',
      timestamp: expect.any(String),
    }));
  });

  it('should not send socket message if user is offline', async () => {
    (connectedUsers.get as jest.Mock).mockReturnValue(undefined);

    const payload = {
      userId: 2,
      reportId: 10,
      type: 'TEST',
      message: 'Hello',
    };

    await sendNotification(payload);

    expect(NotificationService.createNotification).toHaveBeenCalled();
    expect(connectedUsers.get).toHaveBeenCalledWith(2);
    expect(getIO).not.toHaveBeenCalled();
  });

  it('should handle socket errors gracefully', async () => {
    (connectedUsers.get as jest.Mock).mockReturnValue('socket-123');
    mockEmit.mockImplementation(() => { throw new Error('Socket failed'); });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const payload = {
      userId: 1,
      reportId: 10,
      type: 'TEST',
      message: 'Hello',
    };

    // Should not throw
    await sendNotification(payload);

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
