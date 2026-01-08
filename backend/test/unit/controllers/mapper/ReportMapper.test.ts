import { mapReportToReportDTO, mapReportsToReportsDTO } from '../../../../src/controllers/mapper/ReportMapper';
import { UserReport } from '../../../../src/controllers/interface/UserReports';

// Mock dependencies
jest.mock('../../../../src/controllers/mapper/MessageDBToMessage', () => ({
  mapMessagesDBToMessages: jest.fn().mockReturnValue([{ id: 1, text: 'msg' }]),
}));

describe('ReportMapper', () => {
  const mockReport: UserReport = {
    id: 1,
    title: 'Test',
    description: 'Desc',
    latitude: '10.5',
    longitude: '20.5',
    timestamp: '2023-01-01',
    anonymous: false,
    user_id: 100,
    status: 'OPEN',
    category: { category: 'Roads' },
    photos: [{ report_photo: 'url1' }],
    messages: []
  } as any; 

  describe('mapReportToReportDTO', () => {
    it('should map UserReport to UserReportDTO', () => {
      const result = mapReportToReportDTO(mockReport);

      expect(result).toEqual(expect.objectContaining({
        id: 1,
        title: 'Test',
        description: 'Desc',
        latitude: 10.5,
        longitude: 20.5,
        category: 'Roads',
        photos: ['url1'],
        publicMessages: [{ id: 1, text: 'msg' }]
      }));
    });

    it('should handle undefined messages', () => {
        const reportNoMsgs = { ...mockReport, messages: undefined };
        const result = mapReportToReportDTO(reportNoMsgs as any);
        expect(result.publicMessages).toBeDefined();
    });
  });

  describe('mapReportsToReportsDTO', () => {
    it('should map array of reports', () => {
      const result = mapReportsToReportsDTO([mockReport]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should return empty array if input is null/undefined', () => {
      expect(mapReportsToReportsDTO(null as any)).toEqual([]);
      expect(mapReportsToReportsDTO(undefined as any)).toEqual([]);
    });

    it('should return empty array if input is empty', () => {
        expect(mapReportsToReportsDTO([])).toEqual([]);
      });
  });
});
