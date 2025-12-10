import request from 'supertest';
import express from 'express';
import officerRoutes from '../../src/routes/v1/officer';
import { errorHandler } from '../../src/middleware/errorHandler';
import * as officerController from '../../src/controllers/OfficerController';
import { supabase } from '../../src/utils/Supabase';

// Mock dependencies
jest.mock('../../src/controllers/OfficerController');
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
    if (token === 'citizen-token') {
      return { id: 2, role: 'CITIZEN' };
    }
    throw new Error('Invalid token');
  }),
}));

describe('Officer Routes Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1', officerRoutes);
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
                if (authHeader === 'Bearer citizen-token') {
                  return Promise.resolve({
                    data: { id: 2, email: 'citizen@example.com', role: 'CITIZEN' },
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

  describe('GET /api/v1/reports', () => {
    it('should get all reports as officer', async () => {
      (global as any).mockAuthHeader = 'Bearer officer-token';

      const mockReports = [
        { id: 1, title: 'Report 1', status: 'PENDING' },
        { id: 2, title: 'Report 2', status: 'APPROVED' },
      ];

      (officerController.getAllReports as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockReports,
        });
      });

      const response = await request(app)
        .get('/api/v1/reports')
        .set('Authorization', 'Bearer officer-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return 403 for non-officer user', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const response = await request(app)
        .get('/api/v1/reports')
        .set('Authorization', 'Bearer citizen-token');

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/v1/report/:id', () => {
    it('should get report by ID as officer', async () => {
      (global as any).mockAuthHeader = 'Bearer officer-token';

      const mockReport = {
        id: 1,
        title: 'Test Report',
        description: 'Test Description',
        status: 'PENDING',
      };

      (officerController.getReportById as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockReport,
        });
      });

      const response = await request(app)
        .get('/api/v1/report/1')
        .set('Authorization', 'Bearer officer-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
    });
  });

  describe('PATCH /api/v1/status/:id', () => {
    it('should update report status as officer', async () => {
      (global as any).mockAuthHeader = 'Bearer officer-token';

      const mockUpdatedReport = {
        id: 1,
        title: 'Test Report',
        status: 'IN_PROGRESS',
      };

      (officerController.updateReportStatus as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockUpdatedReport,
        });
      });

      const response = await request(app)
        .patch('/api/v1/status/1')
        .set('Authorization', 'Bearer officer-token')
        .send({
          status: 'IN_PROGRESS',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('IN_PROGRESS');
    });
  });

  describe('PATCH /api/v1/reports/:id/approve', () => {
    it('should approve report as officer', async () => {
      (global as any).mockAuthHeader = 'Bearer officer-token';

      const mockApprovedReport = {
        id: 1,
        title: 'Test Report',
        status: 'APPROVED',
      };

      (officerController.approveReport as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockApprovedReport,
        });
      });

      const response = await request(app)
        .patch('/api/v1/reports/1/approve')
        .set('Authorization', 'Bearer officer-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('APPROVED');
    });
  });

  describe('PATCH /api/v1/reports/:id/reject', () => {
    it('should reject report as officer', async () => {
      (global as any).mockAuthHeader = 'Bearer officer-token';

      const mockRejectedReport = {
        id: 1,
        title: 'Test Report',
        status: 'REJECTED',
      };

      (officerController.rejectReport as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockRejectedReport,
        });
      });

      const response = await request(app)
        .patch('/api/v1/reports/1/reject')
        .set('Authorization', 'Bearer officer-token')
        .send({
          motivation: 'Invalid report content',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('REJECTED');
    });
  });

  describe('Authentication and Authorization', () => {
    it('should return 401 for unauthenticated request', async () => {
      (global as any).mockAuthHeader = undefined;

      const response = await request(app).get('/api/v1/reports');

      expect(response.status).toBe(401);
    });

    it('should return 403 for unauthorized role', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const response = await request(app)
        .get('/api/v1/reports')
        .set('Authorization', 'Bearer citizen-token');

      expect(response.status).toBe(403);
    });
  });
});
