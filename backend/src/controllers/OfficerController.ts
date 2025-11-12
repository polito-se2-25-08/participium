import { UpdateReportStatusDTO } from "../dto/UpdateReportStatus";
import { Report } from "../models/Report";
import * as OfficerService from "../services/OfficerService";
import { Request, Response } from "express";

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports: Report[] = await OfficerService.getAllReports();
    return res.status(200).json(reports);
  } catch (err) {
    console.log(err);
  }
};

export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const numericId = Number(id);

    const report = await OfficerService.updateReportStatus(numericId, status);
    return res.status(200).json(report);
  } catch {}
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const numericId = Number(id);

    const report = await OfficerService.getReportById(numericId);
    return res.status(200).json(report);
  } catch (err) {}
};
