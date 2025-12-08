import { Report } from "../models/Report";
import {
  getReportsByCategoryAndStatus,
  getReportsByTechnician,
} from "../repositories/ReportRepository";
import { getTechnicianCategories } from "../repositories/TechnicianRepository";

// Function to get reports for a technician based on their category
export const getReportsForTechnician = async (
  technician_id: number,
  statusFilter?: Report["status"]
): Promise<Report[]> => {
  // Fetch technician category
  const category_id = await getTechnicianCategories(technician_id);

  const status = ["ASSIGNED", "IN_PROGRESS", "SUSPENDED"] as Report["status"][];

  // Fetch reports for that category
  const reports = await getReportsByTechnician(category_id, status);

  return reports;
};

export const getCategoriesForTechnician = async (
  technician_id: number
): Promise<number[]> => {
  return await getTechnicianCategories(technician_id);
};
