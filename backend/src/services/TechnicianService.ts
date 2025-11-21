import { Report } from "../models/Report";
import { getReportsByCategoryAndStatus } from "../repositories/ReportRepository";
import { getTechnicianCategory } from "../repositories/TechnicianRepository";

// Function to get reports for a technician based on their category
export const getReportsForTechnician = async (
  technician_id: number,
  statusFilter?: Report["status"]
): Promise<Report[]> => {
  // Fetch technician category
  const category_id = await getTechnicianCategory(technician_id);
  // Fetch reports for that category and status (if provided otherwise default to "ASSIGNED")
  const reports = await getReportsByCategoryAndStatus(
    category_id,
    statusFilter || "ASSIGNED"
  );
  return reports;
};
