import { Report } from "../models/Report";
import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const createReport = async (
  reportData: Partial<Report> & { photos: string[] }
): Promise<Report> => {
  const { photos, ...reportFields } = reportData;

  const { data, error } = await supabase
    .from("Report")
    .insert([reportFields])
    .select()
    .single();
  
  if (error) {
    throw new AppError(
      `Failed to create report: ${error.message}`,
      500,
      "DB_INSERT_ERROR"
    );
  }

  // Insert photos into Report_Photo table
  if (photos.length > 0) {
    const photoInserts = photos.map((photo) => ({
      report_id: data.id,
      report_photo: photo,
    }));

    const { error: photoError } = await supabase
      .from("Report_Photo")
      .insert(photoInserts);

    if (photoError) {
      throw new AppError(
        `Failed to save report photos: ${photoError.message}`,
        500,
        "DB_INSERT_ERROR"
      );
    }
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

export const getActiveReports = async (): Promise<Report[]> => {
  const { data, error } = await supabase
    .from("Report")
    .select("*")
    .in("status", ["ASSIGNED", "IN_PROGRESS", "SUSPENDED", "REJECTED", "RESOLVED"])
    .order("timestamp", { ascending: false });
 
  if (error) {
    throw new AppError(
      `Failed to fetch active reports: ${error.message}`,
      500,
      "DB_FETCH_ERROR"
    );
  }
  console.log("Active reports fetched:", data);
  return data;
};


export const getFilteredReports = async (userId: string, category: string[], status: string[], reportsFrom: string, reportsUntil: string): Promise<Report[]> => {
  
  const query = supabase.from("Report").select("*");
  
  if( userId ) {
    query.eq("userId", userId);
  }

  if (category.length > 0) {
    query.in("category", category);
  }

  if (status.length > 0) {
    query.in("status", status);
  }
  
  if(reportsFrom)
  {
    query.gte("timestamp", reportsFrom);
  }

  if(reportsUntil)
  {
    query.lte("timestamp", reportsUntil);
  }

  const { data, error } = await query
    .order("timestamp", { ascending: false });

  if (error) {
    throw new AppError(
      `Failed to fetch filtered reports: ${error.message}`,
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
