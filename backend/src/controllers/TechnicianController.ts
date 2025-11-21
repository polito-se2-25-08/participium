import { Request, Response } from "express";
import { Report } from "../models/Report";
import * as TechnicianService from "../services/TechnicianService";
import { ApiResponse } from "../dto/ReportDTO";

export const getReportsForTechnician = async (req: Request, res: Response) => {
  try {
    const { technician_id } = req.params; // Get technician_id from route parameters
    const numericTechnicianId = Number(technician_id); // Convert to number
    const reports: Report[] = await TechnicianService.getReportsForTechnician(
      numericTechnicianId
    ); // Fetch reports for the technician

    // Prepare API response
    const response: ApiResponse<Report[]> = {
      success: true,
      data: reports,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching reports for technician:", error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
    };
    return res.status(500).json(response);
  }
};
