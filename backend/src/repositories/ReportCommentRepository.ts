import { ReportComment, ReportCommentInsert } from "../models/ReportComment";
import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const createComment = async (
  commentData: ReportCommentInsert
): Promise<ReportComment> => {
  const { data, error } = await supabase
    .from("Report_Comment")
    .insert([commentData])
    .select()
    .single();

  if (error) {
    throw new AppError(
      `Failed to create comment: ${error.message}`,
      500,
      "DB_INSERT_ERROR"
    );
  }

  return data;
};

export const getCommentsByReportId = async (
  reportId: number
): Promise<ReportComment[]> => {
  const { data, error } = await supabase
    .from("Report_Comment")
    .select(`
      *,
      sender:User(id, name, surname, role, profile_picture)
    `)
    .eq("report_id", reportId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new AppError(
      `Failed to fetch comments: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }

  return data || [];
};
