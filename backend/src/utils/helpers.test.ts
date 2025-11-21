import { sum, isValidEmail } from './helpers';

describe('Helper Functions', () => {
  describe('sum', () => {
    it('should add two positive numbers', () => {
      expect(sum(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(sum(-1, -1)).toBe(-2);
    });

    it('should handle zero', () => {
      expect(sum(0, 5)).toBe(5);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email without @', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('should reject invalid email without domain', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });
});
