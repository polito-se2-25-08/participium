import { validate } from '../../../src/middleware/validateMiddleware';
import { z } from 'zod';
import AppError from '../../../src/utils/AppError';

describe('validateMiddleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should attach validated body to request on valid input', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    mockReq.body = { name: 'John', age: 30 };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockReq.validatedBody).toEqual({ name: 'John', age: 30 });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with AppError on invalid input', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    mockReq.body = { name: 'John', age: 'invalid' };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain('age');
  });

  it('should handle missing required fields', () => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    mockReq.body = { name: 'John' };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = mockNext.mock.calls[0][0];
    expect(error.message).toContain('email');
  });

  it('should handle multiple validation errors', () => {
    const schema = z.object({
      name: z.string().min(3),
      age: z.number().min(0),
      email: z.string().email(),
    });

    mockReq.body = { name: 'Jo', age: -5, email: 'invalid-email' };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should validate nested objects', () => {
    const schema = z.object({
      user: z.object({
        name: z.string(),
        age: z.number(),
      }),
    });

    mockReq.body = {
      user: {
        name: 'John',
        age: 30,
      },
    };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockReq.validatedBody).toEqual({
      user: { name: 'John', age: 30 },
    });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should validate arrays', () => {
    const schema = z.object({
      tags: z.array(z.string()),
    });

    mockReq.body = { tags: ['tag1', 'tag2', 'tag3'] };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockReq.validatedBody).toEqual({ tags: ['tag1', 'tag2', 'tag3'] });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should handle optional fields', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().optional(),
    });

    mockReq.body = { name: 'John' };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockReq.validatedBody).toEqual({ name: 'John' });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should apply transformations', () => {
    const schema = z.object({
      email: z.string().email().toLowerCase(),
    });

    mockReq.body = { email: 'TEST@EXAMPLE.COM' };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockReq.validatedBody.email).toBe('test@example.com');
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should handle empty body', () => {
    const schema = z.object({
      name: z.string(),
    });

    mockReq.body = {};

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should handle error without issues property', () => {
    const schema = z.object({
      name: z.string(),
    });

    mockReq.body = { name: 123 };

    const middleware = validate(schema);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = mockNext.mock.calls[0][0];
    expect(error.statusCode).toBe(400);
  });
});
