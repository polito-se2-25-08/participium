import { ReportMessage, ReportMessageInsert } from "../models/ReportMessage";
import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const createMessage = async (
  messageData: ReportMessageInsert
): Promise<ReportMessage> => {
  const { data, error } = await supabase
    .from("Report_Message")
    .insert([messageData])
    .select()
    .single();

  if (error) {
    throw new AppError(
      `Failed to create message: ${error.message}`,
      500,
      "DB_INSERT_ERROR"
    );
  }

  return data;
};

export const getMessagesByReportId = async (
  reportId: number
): Promise<ReportMessage[]> => {
  const { data, error } = await supabase
    .from("Report_Message")
    .select(`
      *,
      sender:User(id, name, surname, username)
    `)
    .eq("report_id", reportId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new AppError(
      `Failed to fetch messages: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }

  return data || [];
};