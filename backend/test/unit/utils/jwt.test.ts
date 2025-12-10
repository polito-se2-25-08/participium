// Set env vars before importing modules
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

import { signToken, verifyToken } from '../../../src/utils/jwt';
import jwt from 'jsonwebtoken';

describe('JWT Utils', () => {
  describe('signToken', () => {
    it('should sign a token with payload', () => {
      const payload = { id: 1, role: 'CITIZEN' };
      const token = signToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should create valid JWT tokens', () => {
      const payload = { id: 1, role: 'ADMIN' };
      const token = signToken(payload);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      expect(decoded).toMatchObject(payload);
    });

    it('should include expiration time', () => {
      const payload = { id: 1, role: 'CITIZEN' };
      const token = signToken(payload);
      
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('should handle empty payload', () => {
      const payload = {};
      const token = signToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { id: 1, role: 'CITIZEN' };
      const token = signToken(payload);
      
      const decoded = verifyToken(token);
      expect(decoded).toMatchObject(payload);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it('should throw error for tampered token', () => {
      const payload = { id: 1, role: 'CITIZEN' };
      const token = signToken(payload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      
      expect(() => verifyToken(tamperedToken)).toThrow();
    });

    it('should throw error for expired token', () => {
      const payload = { id: 1, role: 'CITIZEN' };
      const expiredToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '-1s' });
      
      expect(() => verifyToken(expiredToken)).toThrow();
    });
  });
});
