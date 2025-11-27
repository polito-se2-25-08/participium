import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../src/middleware/errorHandler';
import AppError from '../../../src/utils/AppError';

describe('errorHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
    
    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AppError handling', () => {
    it('should handle operational AppError correctly', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Test error',
        code: 'TEST_ERROR',
        statusCode: 400,
      });
    });

    it('should handle 404 errors', () => {
      const error = new AppError('Not found', 404);

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it('should handle 401 unauthorized errors', () => {
      const error = new AppError('Unauthorized', 401);

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
    });
  });

  describe('Supabase error handling', () => {
    it('should handle unique constraint violation (23505)', () => {
      const error = {
        code: '23505',
        message: 'duplicate key value violates unique constraint',
      };

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Duplicate value for a field that must be unique.',
          code: 'SUPABASE_DUPLICATE',
        })
      );
    });

    it('should handle foreign key violation (23503)', () => {
      const error = {
        code: '23503',
        message: 'foreign key violation',
      };

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid reference to another record.',
          code: 'SUPABASE_FK_VIOLATION',
        })
      );
    });

    it('should handle invalid input syntax (22P02)', () => {
      const error = {
        code: '22P02',
        message: 'invalid input syntax',
      };

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid input format.',
          code: 'SUPABASE_INVALID_INPUT',
        })
      );
    });

    it('should handle duplicate key in message', () => {
      const error = {
        message: 'duplicate key violation',
      };

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'SUPABASE_DUPLICATE',
        })
      );
    });
  });

  describe('Zod validation error handling', () => {
    it('should handle ZodError with formatted errors', () => {
      const error = {
        name: 'ZodError',
        errors: [
          { path: ['email'], message: 'Invalid email' },
          { path: ['age'], message: 'Must be a number' },
        ],
      };

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed.',
        code: 'VALIDATION_ERROR',
        errors: [
          { path: 'email', message: 'Invalid email' },
          { path: 'age', message: 'Must be a number' },
        ],
      });
    });
  });

  describe('Generic error handling', () => {
    it('should handle errors without status code', () => {
      const error = new Error('Generic error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(500);
    });

    it('should use default message for errors without message', () => {
      const error = {} as Error;

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        })
      );
    });
  });

  describe('Environment-specific handling', () => {
    it('should include stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: 'Error stack trace',
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });

      process.env.NODE_ENV = originalEnv;
    });
  });
});
