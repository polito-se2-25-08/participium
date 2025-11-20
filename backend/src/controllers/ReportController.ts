import { Request, Response } from "express";
import * as ReportService from "../services/ReportService";
import { ApiResponse, CreateReportDTO } from "../dto/ReportDTO";
import { Report } from "../models/Report";
import { getCategoryId } from "../utils/categoryMapper";

export const createReport = async (req: Request, res: Response) => {
  try {
    const reportData: CreateReportDTO = req.body;
    
    // Convert category name to ID
    const category_id = getCategoryId(reportData.category);
    
    // Extract user_id from JWT (protect middleware ensures this exists)
    const authenticatedUser = (req as any).user;
    const user_id = authenticatedUser?.id;
    
    if (!user_id) {
      const response: ApiResponse<string> = {
        status: false,
        data: "Authentication required"
      };
      return res.status(401).json(response);
    }

    const report = await ReportService.createReport({
      title: reportData.title,
      description: reportData.description,
      category_id,
      latitude: reportData.latitude.toString(),
      longitude: reportData.longitude.toString(),
      anonymous: reportData.anonymous,
      user_id,
      timestamp: new Date().toISOString(),
    });

    const response: ApiResponse<Report> = {
      status: true,
      data: report
    };
    
    return res.status(201).json(response);
  } catch (err: any) {
    console.error("Error creating report:", err);
    const response: ApiResponse<string> = {
      status: false,
      data: err.message || "Unknown error occurred"
    };
    return res.status(500).json(response);
  }
};

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await ReportService.getAllReports();
    const response: ApiResponse<Report[]> = {
      status: true,
      data: reports
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching reports:", err);
    const response: ApiResponse<null> = {
      status: false,
      data: null
    };
    return res.status(500).json(response);
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      const response: ApiResponse<null> = {
        status: false,
        data: null
      };
      return res.status(400).json(response);
    }

    const report = await ReportService.getReportById(numericId);
    const response: ApiResponse<Report> = {
      status: true,
      data: report
    };
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching report:", err);
    const response: ApiResponse<null> = {
      status: false,
      data: null
    };
    return res.status(500).json(response);
  }
};
