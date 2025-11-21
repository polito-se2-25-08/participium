import { Report } from "../models/Report";
import { getReportsByCategory } from "../repositories/ReportRepository";
import { getTechnicianCategory } from "../repositories/TechnicianRepository";

// Function to get reports for a technician based on their category
export const getReportsForTechnician = async (
  technician_id: number
): Promise<Report[]> => {
  // Fetch technician category
  const category_id = await getTechnicianCategory(technician_id);
  // Fetch reports for that category
  const reports = await getReportsByCategory(category_id);
  return reports;
};
