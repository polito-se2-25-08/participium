import * as ReportCommentService from '../../../src/services/ReportCommentService';
import * as ReportCommentRepository from '../../../src/repositories/ReportCommentRepository';

jest.mock('../../../src/repositories/ReportCommentRepository');

describe('ReportCommentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const commentData = {
        report_id: 1,
        sender_id: 1,
        message: 'Test comment',
      };

      const mockComment = {
        id: 1,
        ...commentData,
        created_at: new Date().toISOString(),
      };

      (ReportCommentRepository.createComment as jest.Mock).mockResolvedValue(mockComment);

      const result = await ReportCommentService.createComment(commentData);

      expect(ReportCommentRepository.createComment).toHaveBeenCalledWith(commentData);
      expect(result).toEqual(mockComment);
    });
  });

  describe('getCommentsByReportId', () => {
    it('should return comments for a report', async () => {
      const reportId = 1;
      const mockComments = [
        {
          id: 1,
          report_id: reportId,
          sender_id: 1,
          message: 'Comment 1',
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          report_id: reportId,
          sender_id: 2,
          message: 'Comment 2',
          created_at: new Date().toISOString(),
        },
      ];

      (ReportCommentRepository.getCommentsByReportId as jest.Mock).mockResolvedValue(mockComments);

      const result = await ReportCommentService.getCommentsByReportId(reportId);

      expect(ReportCommentRepository.getCommentsByReportId).toHaveBeenCalledWith(reportId);
      expect(result).toEqual(mockComments);
    });
  });
});
