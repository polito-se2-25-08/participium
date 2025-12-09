import { userService } from '../../../src/services/userService';
import { userRepository } from '../../../src/repositories/userRepository';
import { generateSalt, hashPassword, verifyPassword } from '../../../src/utils/encryption';
import { signToken } from '../../../src/utils/jwt';
import AppError from '../../../src/utils/AppError';

jest.mock('../../../src/repositories/userRepository');
jest.mock('../../../src/utils/encryption');
jest.mock('../../../src/utils/jwt');

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);
      (generateSalt as jest.Mock).mockReturnValue('salt123');
      (hashPassword as jest.Mock).mockReturnValue('hashedPassword123');
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        role: 'CITIZEN',
      });

      const result = await userService.registerUser(userData);

      expect(userRepository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(generateSalt).toHaveBeenCalled();
      expect(hashPassword).toHaveBeenCalledWith('password123', 'salt123');
      expect(userRepository.createUser).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
    });

    it('should throw error if username already exists', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'existinguser',
        password: 'password123',
        name: 'Test',
        surname: 'User',
      };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'existinguser',
      });

      await expect(userService.registerUser(userData)).rejects.toThrow(
        expect.objectContaining({
          message: 'Username taken',
          statusCode: 400,
        })
      );
    });

    it('should register user with telegram username', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        name: 'Test',
        surname: 'User',
        telegram_username: '@testuser',
      };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);
      (generateSalt as jest.Mock).mockReturnValue('salt123');
      (hashPassword as jest.Mock).mockReturnValue('hashedPassword123');
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        role: 'CITIZEN',
      });

      const result = await userService.registerUser(userData);

      expect(result).toHaveProperty('telegram_username', '@testuser');
    });

    it('should set default CITIZEN role', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        name: 'Test',
        surname: 'User',
      };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);
      (generateSalt as jest.Mock).mockReturnValue('salt123');
      (hashPassword as jest.Mock).mockReturnValue('hashedPassword123');
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        role: 'CITIZEN',
      });

      await userService.registerUser(userData);

      expect(userRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'CITIZEN',
        })
      );
    });
  });

  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        salt: 'salt123',
        role: 'CITIZEN',
      };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue(mockUser);
      (verifyPassword as jest.Mock).mockReturnValue(true);
      (signToken as jest.Mock).mockReturnValue('token123');

      const result = await userService.loginUser('testuser', 'password123');

      expect(userRepository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(verifyPassword).toHaveBeenCalledWith('password123', 'salt123', 'hashedPassword');
      expect(signToken).toHaveBeenCalledWith({ id: 1, role: 'CITIZEN' });
      expect(result).toEqual({
        user: mockUser,
        token: 'token123',
      });
    });

    it('should throw error if user does not exist', async () => {
      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);

      await expect(userService.loginUser('nonexistent', 'password123')).rejects.toThrow(
        expect.objectContaining({
          message: "User doesn't exist",
          statusCode: 401,
        })
      );
    });

    it('should throw error if password is invalid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        salt: 'salt123',
        role: 'CITIZEN',
      };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue(mockUser);
      (verifyPassword as jest.Mock).mockReturnValue(false);

      await expect(userService.loginUser('testuser', 'wrongpassword')).rejects.toThrow(
        expect.objectContaining({
          message: 'Invalid password',
          statusCode: 401,
        })
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' },
      ];

      (userRepository.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(userRepository.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array if no users exist', async () => {
      (userRepository.getAllUsers as jest.Mock).mockResolvedValue([]);

      const result = await userService.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: 1, username: 'testuser', role: 'CITIZEN' };

      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toThrow(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 404,
        })
      );
    });
  });

  describe('updateUser', () => {
    it('should update user with camelCase data converted to snake_case', async () => {
      const updateData = {
        profilePicture: 'base64image',
        emailNotification: true,
        telegramUsername: '@user',
      };

      const mockUpdatedUser = {
        id: 1,
        profile_picture: 'base64image',
        email_notification: true,
        telegram_username: '@user',
      };

      (userRepository.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUser(1, updateData);

      expect(userRepository.updateUser).toHaveBeenCalledWith(1, {
        profile_picture: 'base64image',
        email_notification: true,
        telegram_username: '@user',
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should handle partial updates', async () => {
      const updateData = {
        emailNotification: false,
      };

      const mockUpdatedUser = {
        id: 1,
        email_notification: false,
      };

      (userRepository.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUser(1, updateData);

      expect(result).toEqual(mockUpdatedUser);
    });
  });
});
