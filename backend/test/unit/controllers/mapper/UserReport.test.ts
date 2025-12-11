import { mapUserReportToUserReportDTO } from '../../../../src/controllers/mapper/UserReport';

describe('mapUserReportToUserReportDTO', () => {
  it('should map UserReport to UserReportDTO', () => {
    const userReport = {
      id: 1,
      title: 'Title',
      description: 'Desc',
      latitude: 10,
      longitude: 20,
      timestamp: '2023-01-01',
      anonymous: false,
      user_id: 1,
      status: 'OPEN',
      category: { category: 'Category' },
      photos: [{ report_photo: 'photo1' }],
    };

    const result = mapUserReportToUserReportDTO(userReport as any);

    expect(result).toEqual({
      id: 1,
      title: 'Title',
      description: 'Desc',
      latitude: 10,
      longitude: 20,
      timestamp: '2023-01-01',
      anonymous: false,
      userId: 1,
      status: 'OPEN',
      category: 'Category',
      photos: ['photo1'],
    });
  });
});
