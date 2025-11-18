import { Report } from "../models/Report";
import { supabase } from "../utils/Supabase";

export const createReport = async (reportData: Partial<Report>): Promise<Report> => {
  const { data, error } = await supabase
    .from("Report")
    .insert([reportData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getAllReports = async (): Promise<Report[]> => {
  const { data, error } = await supabase
    .from("Report")
    .select("*")
    .order("timestamp", { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getReportById = async (id: number): Promise<Report> => {
  const { data, error } = await supabase
    .from("Report")
    .select("*")
    .eq("id", id);
  if (error) throw error;
  return data[0];
};

export const updateReportStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from("Report")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
  if (!data) return null;
  return data[0];
};
