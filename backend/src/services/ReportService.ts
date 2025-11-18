import { Report, ReportInsert } from "../models/Report";
import * as ReportRepository from "../repositories/ReportRepository";

export const createReport = async (reportData: ReportInsert): Promise<Report> => {
  return await ReportRepository.createReport(reportData);
};

export const getAllReports = async (): Promise<Report[]> => {
  return await ReportRepository.getAllReports();
};

export const getReportById = async (id: number): Promise<Report> => {
  return await ReportRepository.getReportById(id);
};
