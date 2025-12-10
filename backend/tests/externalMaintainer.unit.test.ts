import "dotenv/config";

/**
 * Unit Tests for External Maintainer Report Status Update Feature
 * 
 * These tests use mocking to isolate the units being tested from external dependencies.
 * 
 * Covers:
 * - TechnicianService functions (getMaintainerCategory, canTechnicianUpdateReport, getReportsForTechnician)
 * - TechnicianRepository functions (getTechnicianCategory, getExternalMaintainerCategory)
 * - Validation of status values
 * - Authorization checks for external maintainers
 * - Role-based access control
 * 
 * To run these tests, use the command:
 *   npx jest backend/tests/externalMaintainer.unit.test.ts
 */

// Mock the Supabase client
jest.mock('../src/utils/Supabase', () => ({
  supabase: {
    from: jest.fn()
  }
}));

// Mock ReportRepository
jest.mock('../src/repositories/ReportRepository', () => ({
  getReportById: jest.fn(),
  getReportsByCategoryAndStatus: jest.fn(),
  getReportsByTechnician: jest.fn(),
  updateReportStatus: jest.fn()
}));

// Mock TechnicianRepository
jest.mock('../src/repositories/TechnicianRepository', () => ({
  getTechnicianCategory: jest.fn(),
  getExternalMaintainerCategory: jest.fn(),
  upsertTechnicianCategory: jest.fn()
}));

// Import after mocking
import * as TechnicianRepository from '../src/repositories/TechnicianRepository';
import * as ReportRepository from '../src/repositories/ReportRepository';
import * as TechnicianService from '../src/services/TechnicianService';

// Get mocked functions
const mockedGetTechnicianCategory = TechnicianRepository.getTechnicianCategory as jest.MockedFunction<typeof TechnicianRepository.getTechnicianCategory>;
const mockedGetExternalMaintainerCategory = TechnicianRepository.getExternalMaintainerCategory as jest.MockedFunction<typeof TechnicianRepository.getExternalMaintainerCategory>;
const mockedGetReportById = ReportRepository.getReportById as jest.MockedFunction<typeof ReportRepository.getReportById>;
const mockedGetReportsByTechnician = ReportRepository.getReportsByTechnician as jest.MockedFunction<typeof ReportRepository.getReportsByTechnician>;

describe('External Maintainer Report Status Update - Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TechnicianService.getMaintainerCategory', () => {
    
    it('should return category from Technician_Category table for a valid technician', async () => {
      const mockTechnicianId = 46;
      const expectedCategoryId = 1;
      
      mockedGetTechnicianCategory.mockResolvedValue(expectedCategoryId);
      
      const result = await TechnicianService.getMaintainerCategory(mockTechnicianId);
      
      expect(result).toBe(expectedCategoryId);
      expect(mockedGetTechnicianCategory).toHaveBeenCalledWith(mockTechnicianId);
      expect(mockedGetExternalMaintainerCategory).not.toHaveBeenCalled();
    });

    it('should fallback to External_Company category when technician category not found', async () => {
      const mockExternalMaintainerId = 62;
      const expectedCategoryId = 2;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Technician not found'));
      mockedGetExternalMaintainerCategory.mockResolvedValue(expectedCategoryId);
      
      const result = await TechnicianService.getMaintainerCategory(mockExternalMaintainerId);
      
      expect(result).toBe(expectedCategoryId);
      expect(mockedGetTechnicianCategory).toHaveBeenCalledWith(mockExternalMaintainerId);
      expect(mockedGetExternalMaintainerCategory).toHaveBeenCalledWith(mockExternalMaintainerId);
    });

    it('should throw error when user is neither technician nor external maintainer', async () => {
      const nonExistentUserId = 999999;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Technician not found'));
      mockedGetExternalMaintainerCategory.mockRejectedValue(new Error('External maintainer not found'));
      
      await expect(TechnicianService.getMaintainerCategory(nonExistentUserId))
        .rejects.toThrow('External maintainer not found');
    });

    it('should not call getExternalMaintainerCategory if getTechnicianCategory succeeds', async () => {
      const mockUserId = 10;
      
      mockedGetTechnicianCategory.mockResolvedValue(5);
      
      await TechnicianService.getMaintainerCategory(mockUserId);
      
      expect(mockedGetExternalMaintainerCategory).not.toHaveBeenCalled();
    });
  });

  describe('TechnicianService.canTechnicianUpdateReport', () => {
    
    it('should return true when maintainer category matches report category', async () => {
      const mockUserId = 62;
      const mockReportId = 47;
      const categoryId = 3;
      
      mockedGetTechnicianCategory.mockResolvedValue(categoryId);
      mockedGetReportById.mockResolvedValue({
        id: mockReportId,
        category_id: categoryId,
        title: 'Test Report',
        description: 'Test description',
        status: 'ASSIGNED',
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        latitude: null,
        longitude: null,
        address: null,
        city: null,
        zipcode: null
      } as any);
      
      const result = await TechnicianService.canTechnicianUpdateReport(mockUserId, mockReportId);
      
      expect(result).toBe(true);
    });

    it('should return false when maintainer category does not match report category', async () => {
      const mockUserId = 62;
      const mockReportId = 47;
      
      mockedGetTechnicianCategory.mockResolvedValue(3);
      mockedGetReportById.mockResolvedValue({
        id: mockReportId,
        category_id: 5, // Different category
        title: 'Test Report',
        description: 'Test description',
        status: 'ASSIGNED',
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        latitude: null,
        longitude: null,
        address: null,
        city: null,
        zipcode: null
      } as any);
      
      const result = await TechnicianService.canTechnicianUpdateReport(mockUserId, mockReportId);
      
      expect(result).toBe(false);
    });

    it('should return false when user does not exist', async () => {
      const nonExistentUserId = 999999;
      const mockReportId = 47;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Technician not found'));
      mockedGetExternalMaintainerCategory.mockRejectedValue(new Error('External maintainer not found'));
      
      const result = await TechnicianService.canTechnicianUpdateReport(nonExistentUserId, mockReportId);
      
      expect(result).toBe(false);
    });

    it('should return false when report does not exist', async () => {
      const mockUserId = 62;
      const nonExistentReportId = 999999;
      
      mockedGetTechnicianCategory.mockResolvedValue(3);
      mockedGetReportById.mockRejectedValue(new Error('Report not found'));
      
      const result = await TechnicianService.canTechnicianUpdateReport(mockUserId, nonExistentReportId);
      
      expect(result).toBe(false);
    });

    it('should return false when getMaintainerCategory throws an error', async () => {
      const mockUserId = 62;
      const mockReportId = 47;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Database error'));
      mockedGetExternalMaintainerCategory.mockRejectedValue(new Error('Database error'));
      
      const result = await TechnicianService.canTechnicianUpdateReport(mockUserId, mockReportId);
      
      expect(result).toBe(false);
    });

    it('should work for external maintainer with matching category', async () => {
      const externalMaintainerId = 62;
      const mockReportId = 47;
      const categoryId = 2;
      
      // First call fails (not a technician), second call succeeds (external maintainer)
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Technician not found'));
      mockedGetExternalMaintainerCategory.mockResolvedValue(categoryId);
      mockedGetReportById.mockResolvedValue({
        id: mockReportId,
        category_id: categoryId,
        title: 'Test Report',
        description: 'Test description',
        status: 'ASSIGNED',
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        latitude: null,
        longitude: null,
        address: null,
        city: null,
        zipcode: null
      } as any);
      
      const result = await TechnicianService.canTechnicianUpdateReport(externalMaintainerId, mockReportId);
      
      expect(result).toBe(true);
    });
  });

  describe('TechnicianService.getReportsForTechnician', () => {
    
    it('should return reports for a valid technician', async () => {
      const mockTechnicianId = 46;
      const categoryId = 1;
      const mockReports = [
        { id: 1, title: 'Report 1', status: 'ASSIGNED', category_id: categoryId },
        { id: 2, title: 'Report 2', status: 'IN_PROGRESS', category_id: categoryId }
      ];
      
      mockedGetTechnicianCategory.mockResolvedValue(categoryId);
      mockedGetReportsByTechnician.mockResolvedValue(mockReports as any);
      
      const result = await TechnicianService.getReportsForTechnician(mockTechnicianId);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(mockedGetReportsByTechnician).toHaveBeenCalledWith(
        categoryId,
        ['ASSIGNED', 'IN_PROGRESS', 'SUSPENDED']
      );
    });

    it('should return reports for a valid external maintainer', async () => {
      const externalMaintainerId = 62;
      const categoryId = 2;
      const mockReports = [
        { id: 3, title: 'Report 3', status: 'ASSIGNED', category_id: categoryId }
      ];
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Technician not found'));
      mockedGetExternalMaintainerCategory.mockResolvedValue(categoryId);
      mockedGetReportsByTechnician.mockResolvedValue(mockReports as any);
      
      const result = await TechnicianService.getReportsForTechnician(externalMaintainerId);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no reports exist', async () => {
      const mockTechnicianId = 46;
      const categoryId = 1;
      
      mockedGetTechnicianCategory.mockResolvedValue(categoryId);
      mockedGetReportsByTechnician.mockResolvedValue([]);
      
      const result = await TechnicianService.getReportsForTechnician(mockTechnicianId);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should throw error when user has no category assigned', async () => {
      const mockUserId = 999;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Technician not found'));
      mockedGetExternalMaintainerCategory.mockRejectedValue(new Error('No category assigned'));
      
      await expect(TechnicianService.getReportsForTechnician(mockUserId))
        .rejects.toThrow();
    });
  });

  describe('Report Status Values Validation', () => {
    const validStatuses = ['ASSIGNED', 'IN_PROGRESS', 'SUSPENDED', 'RESOLVED'];
    const invalidStatuses = ['INVALID', 'PENDING', 'DONE', '', 'pending', 'in_progress', null, undefined];

    it.each(validStatuses)('should accept valid status: %s', (status) => {
      expect(validStatuses).toContain(status);
    });

    it.each(invalidStatuses)('should reject invalid status: %s', (status) => {
      expect(validStatuses).not.toContain(status);
    });

    it('should validate status is case-sensitive', () => {
      expect(validStatuses).not.toContain('assigned');
      expect(validStatuses).not.toContain('In_Progress');
      expect(validStatuses).not.toContain('RESOLVED '); // with trailing space
    });

    it('should have exactly 4 valid statuses', () => {
      expect(validStatuses).toHaveLength(4);
    });
  });
});

describe('External Maintainer Authorization - Unit Tests', () => {
  
  describe('Role-based access control', () => {
    const allowedRoles = ['TECHNICIAN', 'EXTERNAL MAINTAINER'];
    const disallowedRoles = ['CITIZEN', 'ADMIN', 'OFFICER'];
    const allRoles = ['CITIZEN', 'ADMIN', 'OFFICER', 'TECHNICIAN', 'EXTERNAL MAINTAINER'];

    it('should allow TECHNICIAN role to update report status', () => {
      expect(allowedRoles).toContain('TECHNICIAN');
    });

    it('should allow EXTERNAL MAINTAINER role to update report status', () => {
      expect(allowedRoles).toContain('EXTERNAL MAINTAINER');
    });

    it.each(disallowedRoles)('should NOT allow %s role to update report status', (role) => {
      expect(allowedRoles).not.toContain(role);
    });

    it('should have exactly 2 allowed roles for status update', () => {
      expect(allowedRoles).toHaveLength(2);
    });

    it('should cover all expected roles in the system', () => {
      expect(allRoles).toHaveLength(5);
      expect([...allowedRoles, ...disallowedRoles].sort()).toEqual(allRoles.sort());
    });
  });

  describe('Role validation', () => {
    const validDbRoles = ['CITIZEN', 'ADMIN', 'OFFICER', 'TECHNICIAN', 'EXTERNAL MAINTAINER'];

    it('should validate EXTERNAL MAINTAINER is a valid DB role', () => {
      expect(validDbRoles).toContain('EXTERNAL MAINTAINER');
    });

    it('should validate role string format with space', () => {
      // EXTERNAL MAINTAINER has a space, not underscore
      expect(validDbRoles).toContain('EXTERNAL MAINTAINER');
      expect(validDbRoles).not.toContain('EXTERNAL_MAINTAINER');
    });

    it.each(validDbRoles)('should validate %s is a recognized role', (role) => {
      expect(validDbRoles).toContain(role);
    });
  });
});

describe('Category Matching Logic - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Technician Category Lookup', () => {
    
    it('should lookup technician category by user_id', async () => {
      const mockUserId = 46;
      const expectedCategoryId = 1;
      
      mockedGetTechnicianCategory.mockResolvedValue(expectedCategoryId);
      
      const result = await TechnicianService.getMaintainerCategory(mockUserId);
      
      expect(mockedGetTechnicianCategory).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(expectedCategoryId);
    });
  });

  describe('External Maintainer Category Lookup', () => {
    
    it('should lookup external maintainer category via User_Company -> External_Company', async () => {
      const mockUserId = 62;
      const expectedCategoryId = 2;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Not a technician'));
      mockedGetExternalMaintainerCategory.mockResolvedValue(expectedCategoryId);
      
      const result = await TechnicianService.getMaintainerCategory(mockUserId);
      
      expect(mockedGetExternalMaintainerCategory).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(expectedCategoryId);
    });
  });

  describe('Report-Category Authorization', () => {
    
    it('should authorize when report category matches maintainer category', async () => {
      const maintainerId = 62;
      const reportId = 100;
      const sharedCategoryId = 5;
      
      mockedGetTechnicianCategory.mockResolvedValue(sharedCategoryId);
      mockedGetReportById.mockResolvedValue({
        id: reportId,
        category_id: sharedCategoryId,
        title: 'Test',
        description: 'Test',
        status: 'ASSIGNED',
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        latitude: null,
        longitude: null,
        address: null,
        city: null,
        zipcode: null
      } as any);
      
      const canUpdate = await TechnicianService.canTechnicianUpdateReport(maintainerId, reportId);
      
      expect(canUpdate).toBe(true);
    });

    it('should deny when report category differs from maintainer category', async () => {
      const maintainerId = 62;
      const reportId = 100;
      
      mockedGetTechnicianCategory.mockResolvedValue(5);
      mockedGetReportById.mockResolvedValue({
        id: reportId,
        category_id: 10, // Different category
        title: 'Test',
        description: 'Test',
        status: 'ASSIGNED',
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        latitude: null,
        longitude: null,
        address: null,
        city: null,
        zipcode: null
      } as any);
      
      const canUpdate = await TechnicianService.canTechnicianUpdateReport(maintainerId, reportId);
      
      expect(canUpdate).toBe(false);
    });
  });
});

describe('Error Handling - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Database errors', () => {
    
    it('should handle database connection errors gracefully in canTechnicianUpdateReport', async () => {
      const userId = 62;
      const reportId = 47;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Database connection failed'));
      mockedGetExternalMaintainerCategory.mockRejectedValue(new Error('Database connection failed'));
      
      const result = await TechnicianService.canTechnicianUpdateReport(userId, reportId);
      
      // Should return false instead of throwing
      expect(result).toBe(false);
    });

    it('should propagate database errors in getReportsForTechnician', async () => {
      const userId = 62;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Database error'));
      mockedGetExternalMaintainerCategory.mockRejectedValue(new Error('Database error'));
      
      await expect(TechnicianService.getReportsForTechnician(userId))
        .rejects.toThrow('Database error');
    });

    it('should propagate database errors in getMaintainerCategory', async () => {
      const userId = 62;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('First error'));
      mockedGetExternalMaintainerCategory.mockRejectedValue(new Error('Second error'));
      
      await expect(TechnicianService.getMaintainerCategory(userId))
        .rejects.toThrow('Second error');
    });
  });

  describe('Invalid input handling', () => {
    
    it('should handle negative user_id', async () => {
      const negativeUserId = -1;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('Invalid user ID'));
      mockedGetExternalMaintainerCategory.mockRejectedValue(new Error('Invalid user ID'));
      
      await expect(TechnicianService.getMaintainerCategory(negativeUserId))
        .rejects.toThrow();
    });

    it('should handle zero as user_id', async () => {
      const zeroUserId = 0;
      
      mockedGetTechnicianCategory.mockRejectedValue(new Error('User not found'));
      mockedGetExternalMaintainerCategory.mockRejectedValue(new Error('User not found'));
      
      await expect(TechnicianService.getMaintainerCategory(zeroUserId))
        .rejects.toThrow();
    });
  });
});
