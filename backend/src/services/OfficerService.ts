import e from "express";
import { Report } from "../models/Report";
import * as ReportRepository from "../repositories/ReportRepository";

export const getAllReports = async (): Promise<Report[]> => {
  return await ReportRepository.getAllReports("OFFICER");
};

export const updateReportStatus = async (id: number, status: string) => {
  return await ReportRepository.updateReportStatus(id, status);
};

export const getReportById = async (id: number) => {
  return await ReportRepository.getReportById(id, "OFFICER");
};

export const approveReport = async (id: number): Promise<Report> => {
  return await ReportRepository.approveReport(id);
};

export const rejectReport = async (id: number, motivation: string): Promise<Report> => {
  return await ReportRepository.rejectReport(id, motivation);
};