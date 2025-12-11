import { Request, Response } from 'express';
import { MessageController } from '../../../src/controllers/MessageController';
import { MessageService } from '../../../src/services/MessageService';

jest.mock('../../../src/services/MessageService');

describe('MessageController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    req = {};
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    res = {
      status,
      json,
    };
    jest.clearAllMocks();
  });

  describe('saveMessage', () => {
    it('should save message and return 201', async () => {
      req.body = {
        message: 'Hello',
        reportId: 1,
        senderId: 1,
      };
      const mockSavedMessage = { id: 1, ...req.body };
      (MessageService.saveMessage as jest.Mock).mockResolvedValue(mockSavedMessage);

      await MessageController.saveMessage(req as Request, res as Response);

      expect(MessageService.saveMessage).toHaveBeenCalledWith('Hello', 1, 1);
      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(mockSavedMessage);
    });
  });
});
