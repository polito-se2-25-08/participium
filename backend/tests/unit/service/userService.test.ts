import { userService } from '../../../src/services/userService';
import AppError from '../../../src/utils/AppError';

// ✅ Mock repository + crypto + jwt (paths fixed)
jest.mock('../../../src/repositories/userRepository', () => ({
  userRepository: {
    findByUsername: jest.fn(),
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
  },
}));

jest.mock('../../../src/utils/encryption', () => ({
  generateSalt: jest.fn(),
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));

jest.mock('../../../src/utils/jwt', () => ({
  signToken: jest.fn(),
}));

import { userRepository } from '../../../src/repositories/userRepository';
import { generateSalt, hashPassword, verifyPassword } from '../../../src/utils/encryption';
import { signToken } from '../../../src/utils/jwt';

describe('userService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('registerUser', () => {
    it('throws if username taken', async () => {
      (userRepository.findByUsername as jest.Mock).mockResolvedValue({ id: 'u1' });

      await expect(
        userService.registerUser({
          email: 'a@b.com',
          username: 'alice',
          password: 'secret',
          name: 'Alice',
          surname: 'Doe',
        })
      ).rejects.toEqual(new AppError('Username taken', 400));
    });

    it('hashes password, sets defaults, returns created user', async () => {
      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);
      (generateSalt as jest.Mock).mockReturnValue('salt123');
      (hashPassword as jest.Mock).mockReturnValue('hashedPW');
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        id: 'u2',
        email: 'a@b.com',
        username: 'alice',
        password: 'hashedPW',
        salt: 'salt123',
        name: 'Alice',
        surname: 'Doe',
        role: 'CITIZEN',
        profile_picture: null,
        email_notification: null,
      });

      const result = await userService.registerUser({
        email: 'a@b.com',
        username: 'alice',
        password: 'secret',
        name: 'Alice',
        surname: 'Doe',
      });

      expect(generateSalt).toHaveBeenCalled();
      expect(hashPassword).toHaveBeenCalledWith('secret', 'salt123');

      expect(userRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'a@b.com',
          username: 'alice',
          password: 'hashedPW',
          salt: 'salt123',
          role: 'CITIZEN',
          profile_picture: null,
          email_notification: null,
        })
      );

      expect(result).toEqual(expect.objectContaining({ id: 'u2', username: 'alice' }));
    });
  });

  describe('loginUser', () => {
    it("throws 401 if user doesn't exist", async () => {
      (userRepository.findByUsername as jest.Mock).mockResolvedValue(null);

      await expect(userService.loginUser('alice', 'secret')).rejects.toEqual(
        new AppError("User doesn't exist", 401)
      );
    });

    it('throws 401 if password invalid', async () => {
      (userRepository.findByUsername as jest.Mock).mockResolvedValue({
        id: 'u1',
        salt: 'salt',
        password: 'storedHash',
        role: 'CITIZEN',
      });
      (verifyPassword as jest.Mock).mockReturnValue(false);

      await expect(userService.loginUser('alice', 'bad')).rejects.toEqual(
        new AppError('Invalid password', 401)
      );
    });

    it('returns { user, token } on success', async () => {
      const user = {
        id: 'u1',
        salt: 'salt',
        password: 'storedHash',
        role: 'CITIZEN',
        email: 'a@b.com',
        username: 'alice',
      };
      (userRepository.findByUsername as jest.Mock).mockResolvedValue(user);
      (verifyPassword as jest.Mock).mockReturnValue(true);
      (signToken as jest.Mock).mockReturnValue('jwt123');

      const result = await userService.loginUser('alice', 'secret');

      expect(verifyPassword).toHaveBeenCalledWith('secret', 'salt', 'storedHash');
      expect(signToken).toHaveBeenCalledWith({ id: 'u1', role: 'CITIZEN' });
      expect(result).toEqual({ user, token: 'jwt123' });
    });
  });

  describe('getAllUsers', () => {
    it('returns repository list', async () => {
      (userRepository.getAllUsers as jest.Mock).mockResolvedValue([{ id: 'u1' }]);
      const list = await userService.getAllUsers();
      expect(list).toEqual([{ id: 'u1' }]);
    });
  });
});
