import { adminService } from '../../../src/services/AdminService';
import { userRepository } from '../../../src/repositories/userRepository';
import { upsertTechnicianCategories } from '../../../src/repositories/TechnicianRepository';
import { generateSalt, hashPassword } from '../../../src/utils/encryption';
import AppError from '../../../src/utils/AppError';

jest.mock('../../../src/repositories/userRepository');
jest.mock('../../../src/repositories/TechnicianRepository');
jest.mock('../../../src/utils/encryption');

describe('AdminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user with generated password', async () => {
      const userData = {
        email: 'officer@example.com',
        username: 'officer1',
        role: 'OFFICER',
        name: 'Test',
        surname: 'Officer',
      };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);
      (generateSalt as jest.Mock).mockReturnValue('salt123');
      (hashPassword as jest.Mock).mockReturnValue('hashedPassword');
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        password: 'hashedPassword',
        salt: 'salt123',
      });

      const result = await adminService.createUser(userData);

      expect(userRepository.findByUsername).toHaveBeenCalledWith('officer1');
      expect(generateSalt).toHaveBeenCalled();
      expect(hashPassword).toHaveBeenCalled();
      expect(userRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'officer@example.com',
          username: 'officer1',
          role: 'OFFICER',
          name: 'Test',
          surname: 'Officer',
        })
      );
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('password');
      expect(typeof result.password).toBe('string');
    });

    it('should throw error if username already exists', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'existinguser',
        role: 'OFFICER',
        name: 'Test',
        surname: 'User',
      };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'existinguser',
      });

      await expect(adminService.createUser(userData)).rejects.toThrow(
        expect.objectContaining({
          message: 'Username taken',
          statusCode: 400,
        })
      );
    });

    it('should generate password with required complexity', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        role: 'TECHNICIAN',
        name: 'Test',
        surname: 'User',
      };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);
      (generateSalt as jest.Mock).mockReturnValue('salt123');
      (hashPassword as jest.Mock).mockReturnValue('hashedPassword');

      let capturedPassword = '';
      (userRepository.createUser as jest.Mock).mockImplementation(async (user) => {
        return { ...user, id: 1 };
      });

      const result = await adminService.createUser(userData);

      // Password should be a string and returned in the result
      expect(result.password).toBeDefined();
      expect(typeof result.password).toBe('string');
      expect(result.password.length).toBeGreaterThanOrEqual(8);
      expect(result.password.length).toBeLessThanOrEqual(12);
    });

    it('should set default email_notification to false', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        role: 'OFFICER',
        name: 'Test',
        surname: 'User',
      };

      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);
      (generateSalt as jest.Mock).mockReturnValue('salt123');
      (hashPassword as jest.Mock).mockReturnValue('hashedPassword');
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        ...userData,
        email_notification: false,
      });

      await adminService.createUser(userData);

      expect(userRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email_notification: false,
        })
      );
    });
  });

  describe('assignTechnicianCategories', () => {
    it('should assign categories to technician', async () => {
      const mockUser = {
        id: 1,
        role: 'TECHNICIAN',
        username: 'tech1',
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (upsertTechnicianCategories as jest.Mock).mockResolvedValue(undefined);

      const result = await adminService.assignTechnicianCategories(1, [3]);

      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(upsertTechnicianCategories).toHaveBeenCalledWith(1, [3]);
      expect(result).toEqual({
        user_id: 1,
        category_ids: [3],
      });
    });

    it('should throw error if user not found', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        adminService.assignTechnicianCategories(999, [1])
      ).rejects.toThrow(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 404,
        })
      );
    });

    it('should throw error if user is not a technician', async () => {
      const mockUser = {
        id: 1,
        role: 'OFFICER',
        username: 'officer1',
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        adminService.assignTechnicianCategories(1, [1])
      ).rejects.toThrow(
        expect.objectContaining({
          message: 'User must have TECHNICIAN role',
          statusCode: 400,
        })
      );
    });

    it('should throw error for invalid category IDs', async () => {
      const mockUser = {
        id: 1,
        role: 'TECHNICIAN',
        username: 'tech1',
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        adminService.assignTechnicianCategories(1, [0])
      ).rejects.toThrow(
        expect.objectContaining({
          message: 'No valid Category IDs provided',
          statusCode: 400,
        })
      );

      await expect(
        adminService.assignTechnicianCategories(1, [10])
      ).rejects.toThrow(
        expect.objectContaining({
          message: 'No valid Category IDs provided',
          statusCode: 400,
        })
      );

      await expect(
        adminService.assignTechnicianCategories(1, [-1])
      ).rejects.toThrow(
        expect.objectContaining({
          message: 'No valid Category IDs provided',
          statusCode: 400,
        })
      );
    });

    it('should throw error if category IDs is null or not an array', async () => {
      const mockUser = {
        id: 1,
        role: 'TECHNICIAN',
        username: 'tech1',
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        adminService.assignTechnicianCategories(1, null as any)
      ).rejects.toThrow(
        expect.objectContaining({
          message: 'Category IDs must be provided as an array',
          statusCode: 400,
        })
      );
    });

    it('should accept valid category IDs (1-9)', async () => {
      const mockUser = {
        id: 1,
        role: 'TECHNICIAN',
        username: 'tech1',
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (upsertTechnicianCategories as jest.Mock).mockResolvedValue(undefined);

      for (let categoryId = 1; categoryId <= 9; categoryId++) {
        const result = await adminService.assignTechnicianCategories(1, [categoryId]);
        expect(result.category_ids).toEqual([categoryId]);
      }
    });

    it('should handle repository errors', async () => {
      (userRepository.findById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        adminService.assignTechnicianCategories(1, [1])
      ).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Failed to load user'),
          statusCode: 500,
        })
      );
    });
  });
});
