import { Request, Response, NextFunction } from 'express';
import { protect, restrictTo } from '../../../src/middleware/authMiddleware';
import { verifyToken } from '../../../src/utils/jwt';
import AppError from '../../../src/utils/AppError';

jest.mock('../../../src/utils/jwt');

describe('authMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('protect', () => {
    it('should call next with error when no authorization header', () => {
      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Not authorized, token missing',
          statusCode: 401,
        })
      );
    });

    it('should call next with error when authorization header does not start with Bearer', () => {
      mockReq.headers = { authorization: 'InvalidToken' };

      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Not authorized, token missing',
          statusCode: 401,
        })
      );
    });

    it('should handle empty token after Bearer', () => {
      mockReq.headers = { authorization: 'Bearer ' };

      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired token',
          statusCode: 401,
        })
      );
    });

    it('should verify token and attach user to request on valid token', () => {
      const mockDecoded = { id: 1, role: 'CITIZEN' };
      (verifyToken as jest.Mock).mockReturnValue(mockDecoded);
      mockReq.headers = { authorization: 'Bearer valid.token.here' };

      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('valid.token.here');
      expect((mockReq as any).user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next with error on invalid token', () => {
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      mockReq.headers = { authorization: 'Bearer invalid.token' };

      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired token',
          statusCode: 401,
        })
      );
    });

    it('should call next with error on expired token', () => {
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token expired');
      });
      mockReq.headers = { authorization: 'Bearer expired.token' };

      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired token',
          statusCode: 401,
        })
      );
    });

    it('should handle malformed Bearer token', () => {
      mockReq.headers = { authorization: 'Bearer' };

      protect(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired token',
          statusCode: 401,
        })
      );
    });
  });

  describe('restrictTo', () => {
    it('should allow access when user has correct role', () => {
      mockReq = { user: { id: 1, role: 'ADMIN' } } as any;
      const middleware = restrictTo('ADMIN', 'OFFICER');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should block access when user has wrong role', () => {
      mockReq = { user: { id: 1, role: 'CITIZEN' } } as any;
      const middleware = restrictTo('ADMIN', 'OFFICER');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You do not have permission to perform this action',
          statusCode: 403,
        })
      );
    });

    it('should block access when user is not attached to request', () => {
      mockReq = {} as any;
      const middleware = restrictTo('ADMIN');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User information not found',
          statusCode: 401,
        })
      );
    });

    it('should block access when user has no role property', () => {
      mockReq = { user: { id: 1 } } as any;
      const middleware = restrictTo('ADMIN');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User information not found',
          statusCode: 401,
        })
      );
    });

    it('should allow TECHNICIAN role', () => {
      mockReq = { user: { id: 1, role: 'TECHNICIAN' } } as any;
      const middleware = restrictTo('TECHNICIAN');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow OFFICER role', () => {
      mockReq = { user: { id: 1, role: 'OFFICER' } } as any;
      const middleware = restrictTo('OFFICER');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow CITIZEN role', () => {
      mockReq = { user: { id: 1, role: 'CITIZEN' } } as any;
      const middleware = restrictTo('CITIZEN');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should handle multiple allowed roles', () => {
      mockReq = { user: { id: 1, role: 'OFFICER' } } as any;
      const middleware = restrictTo('ADMIN', 'OFFICER', 'TECHNICIAN');

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
