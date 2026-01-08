import { Telegraf } from 'telegraf';
import notifyAdmin, { sendToChatId, sendToUserId } from '../../../src/featuresBot/notifications';
import bot from '../../../src/bot';
import { userRepository } from '../../../src/repositories/userRepository';

jest.mock('../../../src/bot', () => ({
  telegram: {
    sendMessage: jest.fn(),
  },
}));

jest.mock('../../../src/repositories/userRepository', () => ({
  userRepository: {
    findById: jest.fn(),
  },
}));

describe('Notifications Bot Feature', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('notifyAdmin', () => {
    it('should send message to ADMIN_CHAT_ID', () => {
      process.env.ADMIN_CHAT_ID = '12345';
      const mockBot = {
        telegram: {
          sendMessage: jest.fn(),
        },
      } as unknown as Telegraf;

      notifyAdmin(mockBot, 'Test *message*');

      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith(
        '12345',
        expect.stringContaining('Test \\*message\\*'),
        { parse_mode: 'Markdown' }
      );
    });
  });

  describe('sendToChatId', () => {
    it('should send message to chat ID', async () => {
      await sendToChatId(100, 'Hello_World');

      expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
        100,
        expect.stringContaining('Hello\\_World'),
        { parse_mode: 'Markdown' }
      );
    });

    it('should throw error for invalid chat ID', async () => {
      await expect(sendToChatId(Number('abc'), 'msg')).rejects.toThrow('Invalid chatId');
    });
  });

  describe('sendToUserId', () => {
    it('should send message if user has chat_id (number)', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue({ id: 1, chat_id: 12345 });

      await sendToUserId(1, 'Hi');

      expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
        12345,
        'Hi',
        expect.anything()
      );
    });

    it('should send message if user has chat_id (string)', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue({ id: 1, chat_id: '12345' });

      await sendToUserId(1, 'Hi');

      expect(bot.telegram.sendMessage).toHaveBeenCalledWith(
        12345,
        'Hi',
        expect.anything()
      );
    });

    it('should throw if user not found', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(sendToUserId(99, 'Hi')).rejects.toThrow('User 99 not found');
    });

    it('should throw if user has no chat_id', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue({ id: 1, chat_id: null });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await expect(sendToUserId(1, 'Hi')).rejects.toThrow('Cannot send Telegram message');
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
