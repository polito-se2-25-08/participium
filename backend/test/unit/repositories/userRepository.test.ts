import { userRepository } from '../../../src/repositories/userRepository';
import { supabase } from '../../../src/utils/Supabase';

jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('userRepository', () => {
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;
  let mockEq: jest.Mock;
  let mockMaybeSingle: jest.Mock;
  let mockSingle: jest.Mock;
  let mockInsert: jest.Mock;
  let mockUpdate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockMaybeSingle = jest.fn();
    mockSingle = jest.fn();
    mockEq = jest.fn(() => ({ maybeSingle: mockMaybeSingle, single: mockSingle, select: mockSelect }));
    mockSelect = jest.fn(() => ({ eq: mockEq, single: mockSingle }));
    mockInsert = jest.fn(() => ({ select: mockSelect }));
    mockUpdate = jest.fn(() => ({ eq: mockEq }));
    mockFrom = jest.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
    }));

    (supabase.from as jest.Mock) = mockFrom;
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'CITIZEN',
      };

      mockMaybeSingle.mockResolvedValue({ data: mockUser, error: null });

      const result = await userRepository.findByUsername('testuser');

      expect(mockFrom).toHaveBeenCalledWith('User');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('username', 'testuser');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      const result = await userRepository.findByUsername('nonexistent');

      expect(result).toBeNull();
    });

    it('should throw error on database error', async () => {
      const dbError = new Error('Database error');
      mockMaybeSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(userRepository.findByUsername('testuser')).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'CITIZEN',
      };

      mockMaybeSingle.mockResolvedValue({ data: mockUser, error: null });

      const result = await userRepository.findById(1);

      expect(mockFrom).toHaveBeenCalledWith('User');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 1);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      const result = await userRepository.findById(999);

      expect(result).toBeNull();
    });

    it('should throw error on database error', async () => {
      const dbError = new Error('Database error');
      mockMaybeSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(userRepository.findById(1)).rejects.toThrow('Database error');
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashedPassword',
        salt: 'salt123',
        role: 'CITIZEN',
        name: 'Test',
        surname: 'User',
        email_notification: false,
      };

      const createdUser = { id: 1, ...userData };

      mockSingle.mockResolvedValue({ data: createdUser, error: null });

      const result = await userRepository.createUser(userData);

      expect(mockFrom).toHaveBeenCalledWith('User');
      expect(mockInsert).toHaveBeenCalledWith(userData);
      expect(mockSelect).toHaveBeenCalled();
      expect(result).toEqual(createdUser);
    });

    it('should throw error if insert fails', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashedPassword',
        salt: 'salt123',
        role: 'CITIZEN',
        name: 'Test',
        surname: 'User',
      };

      const dbError = new Error('Insert failed');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(userRepository.createUser(userData)).rejects.toThrow('Insert failed');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', role: 'CITIZEN' },
        { id: 2, username: 'user2', role: 'OFFICER' },
      ];

      mockSelect.mockResolvedValue({ data: mockUsers, error: null });

      const result = await userRepository.getAllUsers();

      expect(mockFrom).toHaveBeenCalledWith('User');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockUsers);
    });

    it('should throw error on database error', async () => {
      const dbError = new Error('Database error');
      mockSelect.mockResolvedValue({ data: null, error: dbError });

      await expect(userRepository.getAllUsers()).rejects.toThrow('Database error');
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const updates = { name: 'Updated', surname: 'Name' };
      const updatedUser = { id: 1, username: 'user1', ...updates };

      mockSingle.mockResolvedValue({ data: updatedUser, error: null });

      const result = await userRepository.updateUser(1, updates);

      expect(mockFrom).toHaveBeenCalledWith('User');
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith('id', 1);
      expect(result).toEqual(updatedUser);
    });

    it('should throw error on database error', async () => {
      const dbError = new Error('Update failed');
      mockSingle.mockResolvedValue({ data: null, error: dbError });

      await expect(userRepository.updateUser(1, { name: 'Test' })).rejects.toThrow('Update failed');
    });
  });
});
