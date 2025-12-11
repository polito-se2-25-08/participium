import { MessageService } from '../../../src/services/MessageService';
import { MessageRepository } from '../../../src/repositories/MessageRepository';

jest.mock('../../../src/repositories/MessageRepository');

describe('MessageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveMessage', () => {
    it('should call repository.saveMessage', async () => {
      const mockData = { id: 1, message: 'Hello' };
      (MessageRepository.saveMessage as jest.Mock).mockResolvedValue(mockData);

      const result = await MessageService.saveMessage('Hello', 1, 1);

      expect(MessageRepository.saveMessage).toHaveBeenCalledWith('Hello', 1, 1);
      expect(result).toEqual(mockData);
    });
  });
});
