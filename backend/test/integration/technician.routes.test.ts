import request from 'supertest';
import express from 'express';
import technicianRoutes from '../../src/routes/v1/technicianRoutes';
import { errorHandler } from '../../src/middleware/errorHandler';
import * as technicianController from '../../src/controllers/TechnicianController';
import { supabase } from '../../src/utils/Supabase';

// Mock dependencies
jest.mock('../../src/controllers/TechnicianController');
jest.mock('../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));
jest.mock('../../src/utils/jwt', () => ({
  signToken: jest.fn((userId: number) => `mock-token-${userId}`),
  verifyToken: jest.fn((token: string) => {
    if (token === 'technician-token') {
      return { id: 1, role: 'TECHNICIAN' };
    }
    if (token === 'citizen-token') {
      return { id: 2, role: 'CITIZEN' };
    }
    throw new Error('Invalid token');
  }),
}));

describe('Technician Routes Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/technician', technicianRoutes);
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
                if (authHeader === 'Bearer technician-token') {
                  return Promise.resolve({
                    data: { id: 1, email: 'tech@example.com', role: 'TECHNICIAN' },
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

  describe('GET /api/v1/technician/reports', () => {
    it('should get assigned reports for technician', async () => {
      (global as any).mockAuthHeader = 'Bearer technician-token';

      const mockReports = [
        { id: 1, title: 'Repair 1', status: 'ASSIGNED', category_id: 1 },
        { id: 2, title: 'Repair 2', status: 'IN_PROGRESS', category_id: 1 },
      ];

      (technicianController.getReportsForTechnician as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockReports,
        });
      });

      const response = await request(app)
        .get('/api/v1/technician/reports')
        .set('Authorization', 'Bearer technician-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should get filtered reports by status', async () => {
      (global as any).mockAuthHeader = 'Bearer technician-token';

      const mockReports = [
        { id: 1, title: 'Repair 1', status: 'ASSIGNED', category_id: 1 },
      ];

      (technicianController.getReportsForTechnician as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockReports,
        });
      });

      const response = await request(app)
        .get('/api/v1/technician/reports?status=ASSIGNED')
        .set('Authorization', 'Bearer technician-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('ASSIGNED');
    });

    it('should return 403 for non-technician user', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const response = await request(app)
        .get('/api/v1/technician/reports')
        .set('Authorization', 'Bearer citizen-token');

      expect(response.status).toBe(403);
    });

    it('should return 401 for unauthenticated request', async () => {
      (global as any).mockAuthHeader = undefined;

      const response = await request(app).get('/api/v1/technician/reports');

      expect(response.status).toBe(401);
    });
  });

  describe('Authentication and Authorization', () => {
    it('should reject requests without authentication', async () => {
      (global as any).mockAuthHeader = undefined;

      const response = await request(app).get('/api/v1/technician/reports');

      expect(response.status).toBe(401);
    });

    it('should reject requests with wrong role', async () => {
      (global as any).mockAuthHeader = 'Bearer citizen-token';

      const response = await request(app)
        .get('/api/v1/technician/reports')
        .set('Authorization', 'Bearer citizen-token');

      expect(response.status).toBe(403);
    });

    it('should accept requests with TECHNICIAN role', async () => {
      (global as any).mockAuthHeader = 'Bearer technician-token';

      (technicianController.getReportsForTechnician as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: [],
        });
      });

      const response = await request(app)
        .get('/api/v1/technician/reports')
        .set('Authorization', 'Bearer technician-token');

      expect(response.status).toBe(200);
    });
  });
});
