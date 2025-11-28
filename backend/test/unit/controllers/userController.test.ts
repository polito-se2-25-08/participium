import { Request, Response, NextFunction } from 'express';
import * as userController from '../../../src/controllers/userController';
import { userService } from '../../../src/services/userService';

jest.mock('../../../src/services/userService');

describe('userController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    responseJson = jest.fn();
    responseStatus = jest.fn(() => ({ json: responseJson })) as any;
    mockNext = jest.fn();

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: responseStatus,
      json: responseJson,
    };
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        name: 'Test',
        surname: 'User',
      };

      const mockUser = {
        id: 1,
        email: userData.email,
        username: userData.username,
        name: userData.name,
        surname: userData.surname,
      };

      mockRequest.body = userData;
      (userService.registerUser as jest.Mock).mockResolvedValue(mockUser);

      await userController.registerUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.registerUser).toHaveBeenCalledWith(userData);
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
        },
      });
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const credentials = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        username: 'testuser',
        role: 'CITIZEN',
        profile_picture: null,
        email_notification: false,
        telegram_username: null,
      };

      const mockToken = 'jwt-token-123';

      mockRequest.body = credentials;
      (userService.loginUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      await userController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.loginUser).toHaveBeenCalledWith(credentials.username, credentials.password);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: {
          user: {
            id: mockUser.id,
            name: mockUser.name,
            surname: mockUser.surname,
            email: mockUser.email,
            username: mockUser.username,
            role: mockUser.role,
            profilePicture: mockUser.profile_picture,
            emailNotification: mockUser.email_notification,
            telegramUsername: mockUser.telegram_username,
          },
          token: mockToken,
        },
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', role: 'CITIZEN' },
        { id: 2, username: 'user2', role: 'OFFICER' },
      ];

      (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        results: mockUsers.length,
        data: mockUsers,
      });
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'CITIZEN',
      };

      mockRequest.params = { id: '1' };
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await userController.getUserById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });

    it('should return 400 for invalid user ID', async () => {
      mockRequest.params = { id: 'invalid' };

      await userController.getUserById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.getUserById).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid user ID',
      });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updates = {
        name: 'Updated',
        surname: 'Name',
        telegram_username: '@updated',
      };

      const mockUpdatedUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'CITIZEN',
        telegram_username: '@updated',
        email_notification: false,
        profile_picture: null,
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = updates;
      (userService.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);

      await userController.updateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.updateUser).toHaveBeenCalledWith(1, updates);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: {
          id: mockUpdatedUser.id,
          username: mockUpdatedUser.username,
          email: mockUpdatedUser.email,
          role: mockUpdatedUser.role,
          telegramUsername: mockUpdatedUser.telegram_username,
          emailNotification: mockUpdatedUser.email_notification,
          profilePicture: mockUpdatedUser.profile_picture,
        },
      });
    });

    it('should return 400 for invalid user ID', async () => {
      mockRequest.params = { id: 'invalid' };
      mockRequest.body = { name: 'Test' };

      await userController.updateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(userService.updateUser).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        data: {
          message: 'Invalid user ID',
        },
      });
    });
  });
});
