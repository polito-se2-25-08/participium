import { Request, Response } from "express";
import { Report } from "../models/Report";
import * as TechnicianService from "../services/TechnicianService";
import { ApiResponse } from "../dto/ReportDTO";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/AppError";

// Get reports assigned to the authenticated technician, with optional status filtering
export const getReportsForTechnician = catchAsync(
  async (req: Request, res: Response) => {
    // Extract authenticated technician user from request
    const authUser = (req as any).user;
    if (!authUser?.id) {
      throw new AppError("Authentication required", 401, "AUTH_REQUIRED");
    }

    // Get optional status query parameter
    const statusQuery = req.query.status as Report["status"] | undefined;
    // Fetch reports for the technician
    const reports: Report[] = await TechnicianService.getReportsForTechnician(
      authUser.id,
      statusQuery
    );

    const response: ApiResponse<Report[]> = {
      success: true,
      data: reports,
    };
    return res.status(200).json(response);
  }
);

export const getTechnicianCategories = catchAsync(
  async (req: Request, res: Response) => {
    const authUser = (req as any).user;
    if (!authUser?.id) {
      throw new AppError("Authentication required", 401, "AUTH_REQUIRED");
    }

    const categories = await TechnicianService.getCategoriesForTechnician(
      authUser.id
    );

    const response: ApiResponse<number[]> = {
      success: true,
      data: categories,
    };
    return res.status(200).json(response);
  }
);

export const assignExternalOffice = catchAsync(
  async (req: Request, res: Response) => {
    const reportId = Number(req.params.id);
    const { assignedExternalOfficeId } = req.body;

    if (Number.isNaN(reportId)) {
      throw new AppError("Invalid report ID", 400, "INVALID_ID");
    }

    // Only TECHNICIAN can assign/unassign
    const authUser = (req as any).user;
    if (authUser.role !== "TECHNICIAN") {
      throw new AppError(
        "Only technicians can assign reports externally",
        403,
        "NOT_ALLOWED"
      );
    }

    await TechnicianService.assignExternalOffice(
      reportId,
      assignedExternalOfficeId
    );

    res.status(200).json({
      success: true,
      message:
        assignedExternalOfficeId === null
          ? "External assignment removed"
          : "Report assigned to external office",
    });
  }
);
