import { generateSalt, hashPassword, verifyPassword } from '../../../src/utils/encryption';

describe('Encryption Utils', () => {
  describe('generateSalt', () => {
    it('should generate a salt', () => {
      const salt = generateSalt();
      expect(salt).toBeDefined();
      expect(typeof salt).toBe('string');
      expect(salt.length).toBe(32); // 16 bytes = 32 hex characters
    });

    it('should generate unique salts', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      expect(salt1).not.toBe(salt2);
    });
  });

  describe('hashPassword', () => {
    it('should hash a password with a salt', () => {
      const password = 'testPassword123';
      const salt = generateSalt();
      const hash = hashPassword(password, salt);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(128); // 64 bytes = 128 hex characters
    });

    it('should produce consistent hashes for same password and salt', () => {
      const password = 'testPassword123';
      const salt = 'testsalt';
      const hash1 = hashPassword(password, salt);
      const hash2 = hashPassword(password, salt);
      
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different passwords', () => {
      const salt = 'testsalt';
      const hash1 = hashPassword('password1', salt);
      const hash2 = hashPassword('password2', salt);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should produce different hashes for different salts', () => {
      const password = 'testPassword123';
      const hash1 = hashPassword(password, 'salt1');
      const hash2 = hashPassword(password, 'salt2');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', () => {
      const password = 'testPassword123';
      const salt = generateSalt();
      const hash = hashPassword(password, salt);
      
      const isValid = verifyPassword(password, salt, hash);
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', () => {
      const password = 'testPassword123';
      const salt = generateSalt();
      const hash = hashPassword(password, salt);
      
      const isValid = verifyPassword('wrongPassword', salt, hash);
      expect(isValid).toBe(false);
    });

    it('should return false for incorrect salt', () => {
      const password = 'testPassword123';
      const salt = generateSalt();
      const hash = hashPassword(password, salt);
      
      const isValid = verifyPassword(password, 'wrongSalt', hash);
      expect(isValid).toBe(false);
    });

    it('should handle empty passwords', () => {
      const password = '';
      const salt = generateSalt();
      const hash = hashPassword(password, salt);
      
      const isValid = verifyPassword(password, salt, hash);
      expect(isValid).toBe(true);
    });
  });
});
