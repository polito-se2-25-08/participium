import AppError from '../../../src/utils/AppError';

describe('AppError', () => {
  it('should create an error with message and status code', () => {
    const error = new AppError('Test error', 400);
    
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
  });

  it('should set status to "fail" for 4xx errors', () => {
    const error400 = new AppError('Bad request', 400);
    const error404 = new AppError('Not found', 404);
    
    expect(error400.status).toBe('fail');
    expect(error404.status).toBe('fail');
  });

  it('should set status to "error" for 5xx errors', () => {
    const error500 = new AppError('Internal error', 500);
    const error503 = new AppError('Service unavailable', 503);
    
    expect(error500.status).toBe('error');
    expect(error503.status).toBe('error');
  });

  it('should use default code if not provided', () => {
    const error = new AppError('Test error', 400);
    
    expect(error.code).toBe('APP_ERROR');
  });

  it('should use custom code if provided', () => {
    const error = new AppError('Test error', 400, 'CUSTOM_ERROR');
    
    expect(error.code).toBe('CUSTOM_ERROR');
  });

  it('should mark error as operational', () => {
    const error = new AppError('Test error', 400);
    
    expect(error.isOperational).toBe(true);
  });

  it('should capture stack trace', () => {
    const error = new AppError('Test error', 400);
    
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });

  it('should handle different error messages', () => {
    const errors = [
      new AppError('User not found', 404),
      new AppError('Unauthorized', 401),
      new AppError('Validation failed', 422),
    ];
    
    expect(errors[0].message).toBe('User not found');
    expect(errors[1].message).toBe('Unauthorized');
    expect(errors[2].message).toBe('Validation failed');
  });
});
