jest.mock('../../../src/services/userService', () => ({
  userService: {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    getAllUsers: jest.fn(),
  },
}));


import { registerUser, loginUser, getAllUsers } from '../../../src/controllers/userController';
import { userService } from '../../../src/services/userService';


// Helpers to make mock req/res/next
const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = () => jest.fn();

describe('userController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('201 + returns id/email/username on success', async () => {
      (userService.registerUser as jest.Mock).mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        username: 'alice',
      });

      const req: any = {
        body: {
          email: 'a@b.com',
          username: 'alice',
          password: 'secret',
          name: 'Alice',
          surname: 'Doe',
        },
      };
      const res = mockRes();
      const next = mockNext();

      await registerUser(req, res, next);

      expect(userService.registerUser).toHaveBeenCalledWith({
        email: 'a@b.com',
        username: 'alice',
        password: 'secret',
        name: 'Alice',
        surname: 'Doe',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { id: 'u1', email: 'a@b.com', username: 'alice' },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('passes error to next on failure', async () => {
      const err = new Error('boom');
      (userService.registerUser as jest.Mock).mockRejectedValue(err);

      const req: any = { body: {} };
      const res = mockRes();
      const next = mockNext();

      await registerUser(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('loginUser', () => {
    it('200 + returns token + user fields', async () => {
      (userService.loginUser as jest.Mock).mockResolvedValue({
        token: 'jwt123',
        user: {
          id: 'u1',
          email: 'a@b.com',
          username: 'alice',
          role: 'CITIZEN',
        },
      });

      const req: any = { body: { username: 'alice', password: 'secret' } };
      const res = mockRes();
      const next = mockNext();

      await loginUser(req, res, next);

      expect(userService.loginUser).toHaveBeenCalledWith('alice', 'secret');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        token: 'jwt123',
        data: {
          id: 'u1',
          email: 'a@b.com',
          username: 'alice',
          role: 'CITIZEN',
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('passes error to next on failure', async () => {
      const err = new Error('invalid');
      (userService.loginUser as jest.Mock).mockRejectedValue(err);

      const req: any = { body: { username: 'alice', password: 'bad' } };
      const res = mockRes();
      const next = mockNext();

      await loginUser(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getAllUsers', () => {
    it('200 + returns list', async () => {
      (userService.getAllUsers as jest.Mock).mockResolvedValue([
        { id: 'u1' },
        { id: 'u2' },
      ]);

      const req: any = {};
      const res = mockRes();
      const next = mockNext();

      await getAllUsers(req, res, next);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: 2,
        data: [{ id: 'u1' }, { id: 'u2' }],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('passes error to next on failure', async () => {
      const err = new Error('db down');
      (userService.getAllUsers as jest.Mock).mockRejectedValue(err);

      const req: any = {};
      const res = mockRes();
      const next = mockNext();

      await getAllUsers(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
