import { Report, ReportInsert } from "../models/Report";
import * as ReportRepository from "../repositories/ReportRepository";

export const createReport = async (
  reportData: ReportInsert & { photos: string[] }
): Promise<Report> => {
  return await ReportRepository.createReport(reportData);
};

export const getAllReports = async (): Promise<Report[]> => {
  return await ReportRepository.getAllReports();
};

export const getReportById = async (id: number): Promise<Report> => {
  return await ReportRepository.getReportById(id);
};

export const getActiveReports = async (): Promise<Report[]> => {
  return await ReportRepository.getActiveReports();
};

export const getFilteredReports = async (userId: string, category: string[], status: string[], reportsFrom: string, reportsUntil: string): Promise<Report[]> => {
  return await ReportRepository.getFilteredReports(userId, category, status, reportsFrom, reportsUntil);
};

export const approveReport = async (id: number): Promise<Report> => {
  return await ReportRepository.approveReport(id);
};

export const rejectReport = async (id: number, motivation: string, officer_id: number): Promise<Report> => {
  return await ReportRepository.rejectReport(id, motivation);
};

