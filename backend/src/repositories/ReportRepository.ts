import { Report } from "../models/Report";
import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const createReport = async (reportData: Partial<Report>): Promise<Report> => {
  const { data, error } = await supabase
    .from("Report")
    .insert([reportData])
    .select()
    .single();
  
  if (error) {
    throw new AppError(
      `Failed to create report: ${error.message}`,
      500,
      "DB_INSERT_ERROR"
    );
  }
  return data;
};

export const getAllReports = async (): Promise<Report[]> => {
  const { data, error } = await supabase
    .from("Report")
    .select("*")
    .order("timestamp", { ascending: false });
  
  if (error) {
    throw new AppError(
      `Failed to fetch reports: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }
  return data;
};

export const getReportById = async (id: number): Promise<Report> => {
  const { data, error } = await supabase
    .from("Report")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    throw new AppError(
      `Failed to fetch report: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }
  
  if (!data) {
    throw new AppError(
      `Report with id ${id} not found`,
      404,
      "REPORT_NOT_FOUND"
    );
  }
  
  return data;
};

export const updateReportStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from("Report")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
    
  if (error) {
    throw new AppError(
      `Failed to update report status: ${error.message}`,
      500,
      "DB_UPDATE_ERROR"
    );
  }
  
  if (!data) {
    throw new AppError(
      `Report with id ${id} not found`,
      404,
      "REPORT_NOT_FOUND"
    );
  }
  
  return data;
};
