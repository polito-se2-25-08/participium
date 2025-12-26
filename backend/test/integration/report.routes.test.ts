import request from 'supertest';
import express from 'express';
import reportRoutes from '../../src/routes/v1/reportRoutes';
import { errorHandler } from '../../src/middleware/errorHandler';
import * as ReportController from '../../src/controllers/ReportController';
import * as ReportMessageController from '../../src/controllers/ReportMessageController';
import * as NotificationController from '../../src/controllers/NotificationController';
import { supabase } from '../../src/utils/Supabase';

jest.mock('../../src/middleware/authMiddleware', () => ({
  protect: jest.fn((req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      req.user = { id: 1, role: 'CITIZEN' };
      next();
    } else {
      res.status(401).json({ success: false, data: 'Authentication required' });
    }
  }),
  restrictTo: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

// Mock dependencies
jest.mock('../../src/controllers/ReportController');
jest.mock('../../src/controllers/ReportMessageController');
jest.mock('../../src/controllers/NotificationController');
jest.mock('../../src/socket', () => ({
  getIO: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  })),
  connectedUsers: new Map(),
}));
jest.mock('../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));
jest.mock('../../src/utils/jwt', () => ({
  signToken: jest.fn((userId: number) => `mock-token-${userId}`),
  verifyToken: jest.fn((token: string) => {
    if (token === 'citizen-token') {
      return { id: 1, role: 'CITIZEN' };
    }
    if (token === 'technician-token') {
      return { id: 2, role: 'TECHNICIAN' };
    }
    throw new Error('Invalid token');
  }),
}));

describe('Report Routes Integration Tests', () => {
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
                if (authHeader === 'Bearer citizen-token') {
                  return Promise.resolve({
                    data: { id: 1, email: 'citizen@example.com', role: 'CITIZEN' },
                    error: null,
                  });
                }
                if (authHeader === 'Bearer technician-token') {
                  return Promise.resolve({
                    data: { id: 2, email: 'tech@example.com', role: 'TECHNICIAN' },
                    error: null,
                  });
                }
                return Promise.resolve({ data: null, error: 'Not found' });
              }),
            }),
          }),
        };
      }
      return {};
    });
  });

  describe('POST /api/v1/reports', () => {
    it('should create a new report with authentication', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const mockReport = {
        id: 1,
        title: 'Pothole on Main St',
        description: 'Large pothole',
        category_id: 1,
        status: 'PENDING',
      };

      (ReportController.createReport as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({
          success: true,
          data: mockReport,
        });
      });

      const response = await request(app)
        .post('/api/v1/reports')
        .set('Authorization', 'Bearer citizen-token')
        .send({
          title: 'Pothole on Main St',
          description: 'Large pothole causing damage to vehicles',
          category: 'pothole',
          latitude: 40.7128,
          longitude: -74.0060,
          address: '123 Main Street, New York, NY',
          anonymous: false,
          photos: ['photo1.jpg'],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Pothole on Main St');
    });

    it('should return 401 for unauthenticated request', async () => {
      (global as any).mockAuthHeader = undefined;

      const response = await request(app)
        .post('/api/v1/reports')
        .send({
          title: 'Test Report',
          description: 'Test',
          category: 'pothole',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid report data', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const response = await request(app)
        .post('/api/v1/reports')
        .set('Authorization', 'Bearer citizen-token')
        .send({
          title: '', // Invalid - empty title
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/reports', () => {
    it('should get all reports without authentication', async () => {
      const mockReports = [
        { id: 1, title: 'Report 1', status: 'PENDING' },
        { id: 2, title: 'Report 2', status: 'APPROVED' },
      ];

      (ReportController.getAllReports as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockReports,
        });
      });

      const response = await request(app).get('/api/v1/reports').set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/v1/reports/active', () => {
    it('should get active reports', async () => {
      const mockActiveReports = [
        { id: 1, title: 'Active Report', status: 'APPROVED' },
      ];

      (ReportController.getActiveReports as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockActiveReports,
        });
      });

      const response = await request(app).get('/api/v1/reports/active').set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/v1/reports/:id', () => {
    it('should get report by ID', async () => {
      const mockReport = {
        id: 1,
        title: 'Test Report',
        description: 'Test Description',
      };

      (ReportController.getReportById as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockReport,
        });
      });

      const response = await request(app).get('/api/v1/reports/1').set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
    });
  });

  describe('PATCH /api/v1/reports/:id/status', () => {
    it('should update report status', async () => {
      (global as any).mockAuthHeader = 'Bearer technician-token';
      const mockUpdatedReport = {
        id: 1,
        title: 'Test Report',
        status: 'IN_PROGRESS',
      };

      (ReportController.updateReportStatus as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockUpdatedReport,
        });
      });

      const response = await request(app)
        .patch('/api/v1/reports/1/status')
        .set('Authorization', 'Bearer technician-token')
        .send({
          status: 'IN_PROGRESS',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('IN_PROGRESS');
    });
  });

  describe('POST /api/v1/reports/:id/public-messages', () => {
    it('should send message to report with authentication', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const mockMessage = {
        id: 1,
        report_id: 1,
        sender_id: 1,
        message: 'Test message',
      };

      (ReportMessageController.sendPublicMessage as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({
          success: true,
          data: mockMessage,
        });
      });

      const response = await request(app)
        .post('/api/v1/reports/1/public-messages')
        .set('Authorization', 'Bearer citizen-token')
        .send({
          message: 'Test message',
          senderId: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Test message');
    });

    it('should return 401 for unauthenticated message request', async () => {
      (global as any).mockAuthHeader = undefined;

      const response = await request(app)
        .post('/api/v1/reports/1/public-messages')
        .send({
          message: 'Test message',
          senderId: 1,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/reports/:id/messages', () => {
    it('should get messages for report with authentication', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const mockMessages = [
        { id: 1, message: 'Message 1', sender_id: 1 },
        { id: 2, message: 'Message 2', sender_id: 2 },
      ];

      (ReportMessageController.getMessages as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockMessages,
        });
      });

      const response = await request(app)
        .get('/api/v1/reports/1/messages')
        .set('Authorization', 'Bearer citizen-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/v1/notifications', () => {
    it('should get unread notifications with authentication', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const mockNotifications = [
        { id: 1, message: 'Notification 1', read: false },
        { id: 2, message: 'Notification 2', read: false },
      ];

      (NotificationController.getUnreadNotifications as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockNotifications,
        });
      });

      const response = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', 'Bearer citizen-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return 401 for unauthenticated notification request', async () => {
      (global as any).mockAuthHeader = undefined;

      const response = await request(app).get('/api/v1/notifications');

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/notifications/:id/read', () => {
    it('should mark notification as read with authentication', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const mockNotification = {
        id: 1,
        message: 'Notification 1',
        read: true,
      };

      (NotificationController.markNotificationAsRead as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockNotification,
        });
      });

      const response = await request(app)
        .patch('/api/v1/notifications/1/read')
        .set('Authorization', 'Bearer citizen-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.read).toBe(true);
    });
  });
});
