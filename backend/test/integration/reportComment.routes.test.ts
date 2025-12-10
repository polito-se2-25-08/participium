import request from 'supertest';
import express from 'express';
import reportRoutes from '../../src/routes/v1/reportRoutes';
import { errorHandler } from '../../src/middleware/errorHandler';
import * as ReportCommentController from '../../src/controllers/ReportCommentController';
import { supabase } from '../../src/utils/Supabase';

// Mock dependencies
jest.mock('../../src/controllers/ReportCommentController');
jest.mock('../../src/controllers/ReportController', () => ({
  createReport: jest.fn(),
  getAllReports: jest.fn(),
  getActiveReports: jest.fn(),
  getReportById: jest.fn(),
  updateReportStatus: jest.fn(),
}));
jest.mock('../../src/controllers/ReportMessageController', () => ({
  sendMessage: jest.fn(),
  getMessages: jest.fn(),
}));
jest.mock('../../src/controllers/NotificationController', () => ({
  getUnreadNotifications: jest.fn(),
  markNotificationAsRead: jest.fn(),
}));

jest.mock('../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));
jest.mock('../../src/utils/jwt', () => ({
  signToken: jest.fn((userId: number) => `mock-token-${userId}`),
  verifyToken: jest.fn((token: string) => {
    if (token === 'officer-token') {
      return { id: 1, role: 'OFFICER' };
    }
    throw new Error('Invalid token');
  }),
}));

describe('Report Comment Routes Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1', reportRoutes);
    app.use(errorHandler);
    jest.clearAllMocks();

    // Mock supabase for auth middleware
    (supabase.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'User') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockImplementation(() => {
                const authHeader = (global as any).mockAuthHeader;
                if (authHeader === 'Bearer officer-token') {
                  return Promise.resolve({
                    data: { id: 1, email: 'officer@example.com', role: 'OFFICER' },
                    error: null,
                  });
                }
                return Promise.resolve({ data: null, error: { message: 'User not found' } });
              }),
            }),
          }),
        };
      }
      return { select: jest.fn() };
    });
  });

  describe('POST /reports/:id/comments', () => {
    it('should call addComment controller when authenticated', async () => {
      (global as any).mockAuthHeader = 'Bearer officer-token';
      
      (ReportCommentController.addComment as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ success: true, data: {} });
      });

      await request(app)
        .post('/api/v1/reports/1/comments')
        .set('Authorization', 'Bearer officer-token')
        .send({ content: 'Test comment' })
        .expect(201);

      expect(ReportCommentController.addComment).toHaveBeenCalled();
    });

    it('should return 401 when not authenticated', async () => {
      await request(app)
        .post('/api/v1/reports/1/comments')
        .send({ content: 'Test comment' })
        .expect(401);

      expect(ReportCommentController.addComment).not.toHaveBeenCalled();
    });
  });

  describe('GET /reports/:id/comments', () => {
    it('should call getComments controller when authenticated', async () => {
      (global as any).mockAuthHeader = 'Bearer officer-token';

      (ReportCommentController.getComments as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: [] });
      });

      await request(app)
        .get('/api/v1/reports/1/comments')
        .set('Authorization', 'Bearer officer-token')
        .expect(200);

      expect(ReportCommentController.getComments).toHaveBeenCalled();
    });

    it('should return 401 when not authenticated', async () => {
      await request(app)
        .get('/api/v1/reports/1/comments')
        .expect(401);

      expect(ReportCommentController.getComments).not.toHaveBeenCalled();
    });
  });
});
