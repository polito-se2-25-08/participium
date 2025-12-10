import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../../src/utils/catchAsync';

describe('catchAsync', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should call the async function', async () => {
    const asyncFn = jest.fn().mockResolvedValue('success');
    const wrappedFn = catchAsync(asyncFn);

    await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    expect(asyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
  });

  it('should not call next when async function succeeds', async () => {
    const asyncFn = jest.fn().mockResolvedValue('success');
    const wrappedFn = catchAsync(asyncFn);

    await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error when async function fails', async () => {
    const error = new Error('Test error');
    const asyncFn = jest.fn().mockRejectedValue(error);
    const wrappedFn = catchAsync(asyncFn);

    await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should handle multiple calls independently', async () => {
    const asyncFn = jest.fn()
      .mockResolvedValueOnce('success1')
      .mockRejectedValueOnce(new Error('error2'));
    
    const wrappedFn = catchAsync(asyncFn);

    // First call succeeds
    await wrappedFn(mockReq as Request, mockRes as Response, mockNext);
    expect(mockNext).not.toHaveBeenCalled();

    // Second call fails
    mockNext = jest.fn();
    await wrappedFn(mockReq as Request, mockRes as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should preserve request and response objects', async () => {
    let capturedReq: any;
    let capturedRes: any;

    const asyncFn = jest.fn(async (req, res) => {
      capturedReq = req;
      capturedRes = res;
    });

    const wrappedFn = catchAsync(asyncFn);
    await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

    expect(capturedReq).toBe(mockReq);
    expect(capturedRes).toBe(mockRes);
  });
});
