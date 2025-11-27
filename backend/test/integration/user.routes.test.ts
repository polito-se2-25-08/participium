import request from 'supertest';
import express from 'express';
import userRoutes from '../../src/routes/v1/user';
import { errorHandler } from '../../src/middleware/errorHandler';
import * as userController from '../../src/controllers/userController';
import { supabase } from '../../src/utils/Supabase';

// Mock dependencies
jest.mock('../../src/controllers/userController');
jest.mock('../../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));
jest.mock('../../src/utils/jwt', () => ({
  signToken: jest.fn((userId: number) => `mock-token-${userId}`),
  verifyToken: jest.fn((token: string) => {
    if (token === 'valid-token') {
      return { id: 1, role: 'CITIZEN' };
    }
    throw new Error('Invalid token');
  }),
}));

describe('User Routes Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1', userRoutes);
    app.use(errorHandler);
    jest.clearAllMocks();
  });

  describe('POST /api/v1/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        role: 'CITIZEN',
      };

      (userController.registerUser as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({
          success: true,
          data: {
            user: mockUser,
            token: 'mock-token-1',
          },
        });
      });

      const response = await request(app)
        .post('/api/v1/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'Password123!',
          name: 'Test',
          surname: 'User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('should return 400 for invalid registration data', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          email: 'invalid-email',
          username: 'ab', // too short
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/login', () => {
    it('should login user successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
            role: 'CITIZEN',
          },
          token: 'mock-token-1',
        },
      };

      (userController.loginUser as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/api/v1/login')
        .send({
          username: 'testuser',
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/v1/login')
        .send({
          username: 'testuser',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should get all users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', username: 'user1' },
        { id: 2, email: 'user2@example.com', username: 'user2' },
      ];

      (userController.getAllUsers as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockUsers,
        });
      });

      const response = await request(app).get('/api/v1/users');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('should update user successfully', async () => {
      const mockUpdatedUser = {
        id: 1,
        email: 'updated@example.com',
        username: 'updateduser',
      };

      (userController.updateUser as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockUpdatedUser,
        });
      });

      const response = await request(app)
        .patch('/api/v1/users/1')
        .send({
          email: 'updated@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('updated@example.com');
    });
  });

  describe('GET /api/v1/profile', () => {
    it('should return user profile for authenticated user', async () => {
      // Mock supabase query for protect middleware
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 1, email: 'test@example.com', role: 'CITIZEN' },
              error: null,
            }),
          }),
        }),
      });

      const response = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Authorized!');
      expect(response.body.user).toBeDefined();
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app).get('/api/v1/profile');

      expect(response.status).toBe(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
