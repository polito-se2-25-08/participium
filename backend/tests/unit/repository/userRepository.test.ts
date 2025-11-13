// We mock the supabase client module used by userRepository.
const fromFn = jest.fn();

// ✅ Must mock before importing the repository
jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: (...args: any[]) => fromFn(...args),
  },
}));

import { userRepository } from '../../../src/repositories/userRepository';

describe('userRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('returns user when found', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: { id: 'u1', username: 'alice' },
          error: null,
        }),
      };
      fromFn.mockReturnValue(chain);

      const user = await userRepository.findByUsername('alice');

      expect(fromFn).toHaveBeenCalledWith('User');
      expect(chain.select).toHaveBeenCalledWith('*');
      expect(chain.eq).toHaveBeenCalledWith('username', 'alice');
      expect(chain.maybeSingle).toHaveBeenCalled();
      expect(user).toEqual({ id: 'u1', username: 'alice' });
    });

    it('throws on supabase error', async () => {
      const chain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('db error'),
        }),
      };
      fromFn.mockReturnValue(chain);

      await expect(userRepository.findByUsername('alice')).rejects.toThrow('db error');
    });
  });

  describe('createUser', () => {
    it('inserts and returns created row', async () => {
      const chain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 'u2' }, error: null }),
      };
      fromFn.mockReturnValue(chain);

      const result = await userRepository.createUser({ username: 'alice' } as any);

      expect(fromFn).toHaveBeenCalledWith('User');
      expect(chain.insert).toHaveBeenCalledWith({ username: 'alice' });
      expect(chain.select).toHaveBeenCalled();
      expect(chain.single).toHaveBeenCalled();
      expect(result).toEqual({ id: 'u2' });
    });

    it('throws on insert error', async () => {
      const chain = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('insert fail'),
        }),
      };
      fromFn.mockReturnValue(chain);

      await expect(userRepository.createUser({} as any)).rejects.toThrow('insert fail');
    });
  });

  describe('getAllUsers', () => {
    it('returns all rows', async () => {
      const chain = {
        select: jest.fn().mockResolvedValue({
          data: [{ id: 'u1' }, { id: 'u2' }],
          error: null,
        }),
      };
      fromFn.mockReturnValue(chain);

      const result = await userRepository.getAllUsers();
      expect(fromFn).toHaveBeenCalledWith('User');
      expect(chain.select).toHaveBeenCalledWith('*');
      expect(result).toEqual([{ id: 'u1' }, { id: 'u2' }]);
    });

    it('throws on select error', async () => {
      const chain = {
        select: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('select fail'),
        }),
      };
      fromFn.mockReturnValue(chain);

      await expect(userRepository.getAllUsers()).rejects.toThrow('select fail');
    });
  });
});
