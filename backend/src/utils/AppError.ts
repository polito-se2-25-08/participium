export default class AppError extends Error {
  statusCode: number;
  status: string;
  code: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, code = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
