import { todo } from "node:test";
import { Report } from "../models/Report";
import {
  getReportsByCategoryAndStatus,
  getReportsByTechnician,
  getReportById,
} from "../repositories/ReportRepository";
import {
  getTechnicianCategory,
  getTechnicianCategories,
  getExternalMaintainerCategory,
  updateReportExternalAssignment,
} from "../repositories/TechnicianRepository";
import AppError from "../utils/AppError";

// Function to get the category for a technician or external maintainer
export const getMaintainerCategory = async (
  // TODO make it so it works with getTechnicianCategories !! needs to handle multiple category_ids
  user_id: number
): Promise<number[]> => {
  // First try to get the categories from Technician_Category table
  try {
    const categories = await getTechnicianCategories(user_id);
    if (categories && categories.length > 0) {
      return categories;
    }
    // If empty array returned (though usually throws if not found depending on repo implementation), try external
    throw new Error("No technician categories found");
  } catch (error) {
    // If not found in Technician_Category, try External_Company via User_Company
    // Assuming external maintainer still has one category for now, wrap in array
    try {
      const externalCategory = await getExternalMaintainerCategory(user_id);
      return [externalCategory];
    } catch (extError) {
      return [];
    }
  }
};

// Function to get reports for a technician based on their category
export const getReportsForTechnician = async (
  technician_id: number,
  statusFilter?: Report["status"]
): Promise<Report[]> => {
  // Fetch technician category
  console.log("Fetching categories for technician:", technician_id);
  const category_ids = await getMaintainerCategory(technician_id); // TODO
  console.log("Technician categories:", category_ids);

  const status = ["ASSIGNED", "IN_PROGRESS", "SUSPENDED"] as Report["status"][];

  // Fetch reports for that category
  const reports = await getReportsByTechnician(category_ids, status); // TODO

  return reports;
};

export const getCategoriesForTechnician = async (
  technician_id: number
): Promise<number[]> => {
  return await getTechnicianCategories(technician_id);
};

// Function to check if a technician/external maintainer is authorized to update a specific report
export const canTechnicianUpdateReport = async (
  technician_id: number,
  report_id: number
): Promise<boolean> => {
  try {
    // Get the maintainer's categories (works for both technicians and external maintainers)
    const maintainerCategoryIds = await getMaintainerCategory(technician_id); // TODO

    // Get the report's category
    const report = await getReportById(report_id);

    // Check if the report's category is included in the maintainer's categories
    return maintainerCategoryIds.includes(report.category_id); // TODO
  } catch (error) {
    return false;
  }
};

// Prevent modifications when externally assigned
export const ensureReportNotExternallyAssigned = async (report_id: number) => {
  const report = await getReportById(report_id);

  if (!report) {
    throw new AppError("Report not found", 404, "REPORT_NOT_FOUND");
  }

  if (report.assignedExternalOfficeId !== null) {
    throw new AppError(
      "This report is handled by an external office and cannot be modified by local technicians.",
      403,
      "EXTERNAL_LOCK"
    );
  }
};

// Assign / Unassign external office
export const assignExternalOffice = async (
  report_id: number,
  externalOfficeId: number | null
) => {
  const report = await getReportById(report_id);

  if (!report) {
    throw new AppError("Report not found", 404, "REPORT_NOT_FOUND");
  }

  // Allow setting null or a numeric ID
  await updateReportExternalAssignment(report_id, externalOfficeId);
};
