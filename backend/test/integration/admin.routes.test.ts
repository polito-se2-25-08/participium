import request from 'supertest';
import express from 'express';
import adminRoutes from '../../src/routes/v1/adminRoutes';
import { errorHandler } from '../../src/middleware/errorHandler';
import * as adminController from '../../src/controllers/adminController';
import * as userController from '../../src/controllers/userController';
import { supabase } from '../../src/utils/Supabase';

// Mock dependencies
jest.mock('../../src/controllers/adminController');
jest.mock('../../src/controllers/userController');
jest.mock('../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));
jest.mock('../../src/utils/jwt', () => ({
  signToken: jest.fn((userId: number) => `mock-token-${userId}`),
  verifyToken: jest.fn((token: string) => {
    if (token === 'admin-token') {
      return { id: 1, role: 'ADMIN' };
    }
    if (token === 'user-token') {
      return { id: 2, role: 'CITIZEN' };
    }
    throw new Error('Invalid token');
  }),
}));

describe('Admin Routes Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/admin', adminRoutes);
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
                if (authHeader === 'Bearer admin-token') {
                  return Promise.resolve({
                    data: { id: 1, email: 'admin@example.com', role: 'ADMIN' },
                    error: null,
                  });
                }
                if (authHeader === 'Bearer user-token') {
                  return Promise.resolve({
                    data: { id: 2, email: 'user@example.com', role: 'CITIZEN' },
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

  describe('POST /api/v1/admin/register', () => {
    it('should create a new user as admin', async () => {
      (global as any).mockAuthHeader = 'Bearer admin-token';

      const mockUser = {
        id: 3,
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'generatedPassword123',
      };

      (adminController.setupUser as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({
          success: true,
          data: mockUser,
        });
      });

      const response = await request(app)
        .post('/api/v1/admin/register')
        .set('Authorization', 'Bearer admin-token')
        .send({
          email: 'newuser@example.com',
          username: 'newuser',
          role: 'OFFICER',
          name: 'New',
          surname: 'User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('newuser@example.com');
    });

    it('should return 403 for non-admin user', async () => {
      (global as any).mockAuthHeader = 'Bearer user-token';

      const response = await request(app)
        .post('/api/v1/admin/register')
        .set('Authorization', 'Bearer user-token')
        .send({
          email: 'newuser@example.com',
          username: 'newuser',
          role: 'OFFICER',
        });

      expect(response.status).toBe(403);
    });

    it('should return 401 for unauthenticated request', async () => {
      (global as any).mockAuthHeader = undefined;

      const response = await request(app)
        .post('/api/v1/admin/register')
        .send({
          email: 'newuser@example.com',
          username: 'newuser',
          role: 'OFFICER',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/admin/register-technician', () => {
    it('should create a technician with category', async () => {
      (global as any).mockAuthHeader = 'Bearer admin-token';

      const mockTechnician = {
        id: 4,
        email: 'tech@example.com',
        username: 'technician1',
        password: 'generatedPassword123',
        category_id: 2,
      };

      (adminController.setupTechnician as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({
          success: true,
          data: mockTechnician,
        });
      });

      const response = await request(app)
        .post('/api/v1/admin/register-technician')
        .set('Authorization', 'Bearer admin-token')
        .send({
          email: 'tech@example.com',
          username: 'technician1',
          role: 'TECHNICIAN',
          name: 'Tech',
          surname: 'User',
          category_id: 2,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.category_id).toBe(2);
    });
  });

  describe('GET /api/v1/admin/users', () => {
    it('should get all users as admin', async () => {
      (global as any).mockAuthHeader = 'Bearer admin-token';

      const mockUsers = [
        { id: 1, email: 'user1@example.com', role: 'CITIZEN' },
        { id: 2, email: 'user2@example.com', role: 'OFFICER' },
      ];

      (userController.getAllUsers as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockUsers,
        });
      });

      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/v1/admin/users/:id', () => {
    it('should get user by ID as admin', async () => {
      (global as any).mockAuthHeader = 'Bearer admin-token';

      const mockUser = {
        id: 1,
        email: 'user@example.com',
        username: 'user1',
        role: 'CITIZEN',
      };

      (userController.getUserById as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockUser,
        });
      });

      const response = await request(app)
        .get('/api/v1/admin/users/1')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
    });
  });

  describe('PUT /api/v1/admin/users/:id/role', () => {
    it('should update user role as admin', async () => {
      (global as any).mockAuthHeader = 'Bearer admin-token';

      const mockUpdatedUser = {
        id: 2,
        email: 'user@example.com',
        role: 'OFFICER',
      };

      (userController.updateUser as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockUpdatedUser,
        });
      });

      const response = await request(app)
        .put('/api/v1/admin/users/2/role')
        .set('Authorization', 'Bearer admin-token')
        .send({
          role: 'OFFICER',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('OFFICER');
    });
  });

  describe('PUT /api/v1/admin/technicians/:id/categories', () => {
    it('should update technician categories', async () => {
      (global as any).mockAuthHeader = 'Bearer admin-token';

      const mockResult = {
        user_id: 3,
        category_ids: [5],
      };

      (adminController.updateTechnicianCategories as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockResult,
        });
      });

      const response = await request(app)
        .put('/api/v1/admin/technicians/3/categories')
        .set('Authorization', 'Bearer admin-token')
        .send({
          category_ids: [5],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.category_ids).toEqual([5]);
    });
  });
});
