import { normalizeRole, isValidRole, DbRole, VALID_DB_ROLES } from '../../../src/utils/roleMapper';

describe('roleMapper', () => {
  describe('normalizeRole', () => {
    it('should normalize lowercase role to uppercase', () => {
      expect(normalizeRole('citizen')).toBe('CITIZEN');
      expect(normalizeRole('admin')).toBe('ADMIN');
      expect(normalizeRole('officer')).toBe('OFFICER');
      expect(normalizeRole('technician')).toBe('TECHNICIAN');
    });

    it('should handle already uppercase roles', () => {
      expect(normalizeRole('CITIZEN')).toBe('CITIZEN');
      expect(normalizeRole('ADMIN')).toBe('ADMIN');
    });

    it('should trim whitespace', () => {
      expect(normalizeRole('  citizen  ')).toBe('CITIZEN');
      expect(normalizeRole('\tadmin\n')).toBe('ADMIN');
    });

    it('should handle mixed case', () => {
      expect(normalizeRole('CiTiZeN')).toBe('CITIZEN');
      expect(normalizeRole('AdMiN')).toBe('ADMIN');
    });

    it('should throw error for invalid role', () => {
      expect(() => normalizeRole('invalid')).toThrow('Invalid role: invalid');
      expect(() => normalizeRole('user')).toThrow('Invalid role: user');
      expect(() => normalizeRole('')).toThrow();
    });

    it('should accept all valid DB roles', () => {
      VALID_DB_ROLES.forEach(role => {
        expect(normalizeRole(role)).toBe(role);
      });
    });
  });

  describe('isValidRole', () => {
    it('should return true for valid roles', () => {
      expect(isValidRole('citizen')).toBe(true);
      expect(isValidRole('ADMIN')).toBe(true);
      expect(isValidRole('Officer')).toBe(true);
      expect(isValidRole('TECHNICIAN')).toBe(true);
    });

    it('should return false for invalid roles', () => {
      expect(isValidRole('invalid')).toBe(false);
      expect(isValidRole('user')).toBe(false);
      expect(isValidRole('')).toBe(false);
      expect(isValidRole('moderator')).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(isValidRole('  citizen  ')).toBe(true);
      expect(isValidRole('  invalid  ')).toBe(false);
    });
  });

  describe('VALID_DB_ROLES', () => {
    it('should contain all expected roles', () => {
      expect(VALID_DB_ROLES).toContain('CITIZEN');
      expect(VALID_DB_ROLES).toContain('ADMIN');
      expect(VALID_DB_ROLES).toContain('OFFICER');
      expect(VALID_DB_ROLES).toContain('TECHNICIAN');
      expect(VALID_DB_ROLES).toContain('EXTERNAL_MAINTAINER');
    });

    it('should have exactly 5 roles', () => {
      expect(VALID_DB_ROLES).toHaveLength(5);
    });
  });
});
