import { ReportComment, ReportCommentInsert } from "../models/ReportComment";
import * as ReportCommentRepository from "../repositories/ReportCommentRepository";

export const createComment = async (
  commentData: ReportCommentInsert
): Promise<ReportComment> => {
  return await ReportCommentRepository.createComment(commentData);
};

export const getCommentsByReportId = async (
  reportId: number
): Promise<ReportComment[]> => {
  return await ReportCommentRepository.getCommentsByReportId(reportId);
};
