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
