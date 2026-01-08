
import { Request, Response, NextFunction } from 'express';
import * as userController from '../../../src/controllers/userController';
import { userService } from '../../../src/services/userService';
import { userRepository } from '../../../src/repositories/userRepository';
import * as VerificationCodeRepository from '../../../src/repositories/VerificationCodeRepository';
import AppError from '../../../src/utils/AppError';

// Mock dependencies
jest.mock('../../../src/services/userService');
jest.mock('../../../src/repositories/userRepository');
jest.mock('../../../src/repositories/VerificationCodeRepository');

describe('userController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('registerUser', () => {
    it('should create a user successfully', async () => {
      req.body = { email: 'test@example.com', password: 'password123', username: 'testuser' };
      const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' };
      
      (userService.registerUser as jest.Mock).mockResolvedValue(mockUser);

      await userController.registerUser(req as Request, res as Response, next);

      expect(userService.registerUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        name: undefined,
        surname: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
        },
      });
    });

    it('should call next with error if service fails', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const error = new AppError('Error', 400);
      (userService.registerUser as jest.Mock).mockRejectedValue(error);

      await userController.registerUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('loginUser', () => {
    it('should login successfully', async () => {
      req.body = { username: 'testuser', password: 'password123' };
      const mockUser = { 
        id: 1, 
        name: 'Test', 
        surname: 'User', 
        email: 'test@example.com', 
        username: 'testuser', 
        role: 'user', 
        profile_picture: 'pic.jpg',
        email_notification: true,
        telegram_username: 'test_tg',
        isVerified: true
      };
      const mockToken = 'mock-token';

      (userService.loginUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      await userController.loginUser(req as Request, res as Response, next);

      expect(userService.loginUser).toHaveBeenCalledWith('testuser', 'password123', undefined);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getUserById', () => {
    it('should return user details', async () => {
      req.params = { id: '1' }; 
      const mockUser = { id: 1, email: 'test@example.com' };
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      await userController.getUserById(req as Request, res as Response, next);
      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return error if invalid ID', async () => {
        req.params = { id: 'invalid' };
        await userController.getUserById(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
      });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
        req.params = { id: '1' };
        req.body = { email: 'new@example.com' }; 
        const mockUpdatedUser = { id: 1, email: 'new@example.com', username: 'newname', role: 'user', telegram_username: 'tg', email_notification: true, profile_picture: 'pic' };
        (userService.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);
        await userController.updateUser(req as Request, res as Response, next);
        expect(userService.updateUser).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should fail if invalid ID', async () => {
        req.params = { id: 'invalid' };
        await userController.updateUser(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
    }); 
  });

  describe('verifyUser', () => {
    it('should verify user successfully', async () => {
        req.params = { id: '1' };
        req.body = { code: '123456' };
        
        (VerificationCodeRepository.getVerificationCode as jest.Mock).mockResolvedValue('123456');
        (userRepository.verifyUser as jest.Mock).mockResolvedValue(undefined);
        (VerificationCodeRepository.deleteVerificationCode as jest.Mock).mockResolvedValue(undefined);

        await userController.verifyUser(req as Request, res as Response, next);

        expect(VerificationCodeRepository.getVerificationCode).toHaveBeenCalledWith(1);
        expect(userRepository.verifyUser).toHaveBeenCalledWith(1);
        expect(VerificationCodeRepository.deleteVerificationCode).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { result: true } }));
    });

    it('should return false if code mismatches', async () => {
        req.params = { id: '1' };
        req.body = { code: 'wrong' };
        
        (VerificationCodeRepository.getVerificationCode as jest.Mock).mockResolvedValue('123456');

        await userController.verifyUser(req as Request, res as Response, next);

        expect(userRepository.verifyUser).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { result: false } }));
    });

     it('should return error if code expired or not found', async () => {
        req.params = { id: '1' };
        req.body = { code: '123456' };
        
        (VerificationCodeRepository.getVerificationCode as jest.Mock).mockResolvedValue(null);

        await userController.verifyUser(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
            success: false, 
            data: expect.objectContaining({
                message: expect.stringMatching(/not found|expired/)
            })
        }));
    });

    it('should return 400 if invalid input', async () => {
        req.params = { id: 'invalid' };
        req.body = { code: '123456' };
        await userController.verifyUser(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('createVerificationCode', () => {
    it('should create code successfully', async () => {
        req.params = { id: '1' };
        
        (VerificationCodeRepository.InitializeVerificationCode as jest.Mock).mockResolvedValue(undefined);

        await userController.createVerificationCode(req as Request, res as Response, next);

        expect(VerificationCodeRepository.InitializeVerificationCode).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(201);
    });

     it('should return 400 if invalid ID', async () => {
        req.params = { id: 'invalid' };
        await userController.createVerificationCode(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
