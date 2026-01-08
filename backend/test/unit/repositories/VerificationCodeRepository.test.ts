import * as VerificationCodeRepository from '../../../src/repositories/VerificationCodeRepository';
import { supabase } from '../../../src/utils/Supabase';
import { userService } from '../../../src/services/userService';
import { sendEmail } from '../../../src/controllers/mailController';
import AppError from '../../../src/utils/AppError';
import crypto from 'node:crypto';

jest.mock('../../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('../../../src/services/userService', () => ({
  userService: {
    getUserById: jest.fn(),
  },
}));

jest.mock('../../../src/controllers/mailController', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('node:crypto', () => ({
  randomInt: jest.fn(),
}));

describe('VerificationCodeRepository', () => {
  let mockSelect: jest.Mock;
  let mockEq: jest.Mock;
  let mockOrder: jest.Mock;
  let mockLimit: jest.Mock;
  let mockSingle: jest.Mock;
  let mockInsert: jest.Mock;
  let mockDelete: jest.Mock;
  let mockFrom: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSingle = jest.fn();
    mockLimit = jest.fn(() => ({ single: mockSingle }));
    mockOrder = jest.fn(() => ({ limit: mockLimit }));
    mockEq = jest.fn(() => ({
      order: mockOrder,
      delete: jest.fn(),
    }));
    mockSelect = jest.fn(() => ({ eq: mockEq }));
    mockInsert = jest.fn(() => ({ select: jest.fn(() => ({ single: mockSingle })) }));
    mockDelete = jest.fn(() => ({ eq: mockEq })); // Fix chain for delete

    // Re-setup mockFrom to handle different start points
    mockFrom = jest.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      delete: mockDelete,
    }));

    (supabase.from as jest.Mock) = mockFrom;
    (crypto.randomInt as jest.Mock).mockReturnValue(123456);
  });

  describe('InitializeVerificationCode', () => {
    it('should create a code if none exists', async () => {
        // Mock existing code check: returns null (not found)
      mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
        
        // Mock delete
      mockDelete.mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) });

        // Mock insert return
      mockSingle.mockResolvedValueOnce({ 
        data: { userId: 1, code: '123456', expires_at: '2025-01-01' }, 
        error: null 
      });

      (userService.getUserById as jest.Mock).mockResolvedValue({ 
        id: 1, name: 'John', email: 'test@example.com' 
      });

      await VerificationCodeRepository.InitializeVerificationCode(1);

      expect(mockFrom).toHaveBeenCalledWith('VerificationCode');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockInsert).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalledWith(
        ['test@example.com'], 
        expect.any(String), 
        expect.stringContaining('123456')
      );
    });

    it('should not create a code if strict valid one exists', async () => {
        // Future date
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + 10);
      
      mockSingle.mockResolvedValueOnce({ 
        data: { userId: 1, code: '999999', expires_at: futureDate.toISOString() }, 
        error: null 
      });

      await VerificationCodeRepository.InitializeVerificationCode(1);

      expect(mockInsert).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should recreate code if existing one is expired', async () => {
        // Past date
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 10);
      
      mockSingle.mockResolvedValueOnce({ 
        data: { userId: 1, code: '999999', expires_at: pastDate.toISOString() }, 
        error: null 
      });

        // Mock insert return
      mockSingle.mockResolvedValueOnce({ 
        data: { userId: 1, code: '123456' }, 
        error: null 
      });

      (userService.getUserById as jest.Mock).mockResolvedValue({ 
        id: 1, name: 'John', email: 't@t.com' 
      });

      await VerificationCodeRepository.InitializeVerificationCode(1);

      expect(mockDelete).toHaveBeenCalled(); // Should delete old one
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should throw AppError if DB check fails', async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });

      await expect(
        VerificationCodeRepository.InitializeVerificationCode(1)
      ).rejects.toThrow('Failed to get verification code');
    });

    it('should throw AppError if insert fails', async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
      
      // Setup insert to fail
      const insertSelect = jest.fn(() => ({ 
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Insert Fail' } }) 
      }));
      mockInsert.mockReturnValue({ select: insertSelect });

      await expect(
        VerificationCodeRepository.InitializeVerificationCode(1)
      ).rejects.toThrow('Failed to create verification code');
    });
    
    it('should throw AppError if insert return no data', async () => {
        mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
        
        // Setup insert to fail
        const insertSelect = jest.fn(() => ({ 
          single: jest.fn().mockResolvedValue({ data: null, error: null }) 
        }));
        mockInsert.mockReturnValue({ select: insertSelect });
  
        await expect(
          VerificationCodeRepository.InitializeVerificationCode(1)
        ).rejects.toThrow('Failed to create verification code for user_id 1');
      });
  });

  describe('getVerificationCode', () => {
    it('should return code if valid', async () => {
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + 10);

      mockSingle.mockResolvedValue({ 
        data: { userId: 1, code: '123456', expires_at: futureDate.toISOString() }, 
        error: null 
      });

      const start = new Date(); // Start time for measurement
      const code = await VerificationCodeRepository.getVerificationCode(1);
      
      expect(code).toBe('123456');
    });

    it('should return null if code expired', async () => {
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 10);

      mockSingle.mockResolvedValue({ 
        data: { userId: 1, code: '123456', expires_at: pastDate.toISOString() }, 
        error: null 
      });

      const code = await VerificationCodeRepository.getVerificationCode(1);
      
      expect(code).toBeNull();
    });

    it('should return null if not found (PGRST116)', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });

      const code = await VerificationCodeRepository.getVerificationCode(1);
      
      expect(code).toBeNull();
    });

    it('should throw AppError on DB error', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'DB fail' } });

      await expect(
        VerificationCodeRepository.getVerificationCode(1)
      ).rejects.toThrow('Failed to get verification code');
    });
  });
});
