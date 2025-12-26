// Test setup file
import 'dotenv/config';

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Some controllers reference ReportCommentService without importing it.
// Provide a global stub to keep unit tests deterministic.
(global as any).ReportCommentService = {
  createComment: jest.fn(),
  getCommentsByReportId: jest.fn(),
};
