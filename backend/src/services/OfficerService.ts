import e from "express";
import { Report } from "../models/Report";
import * as ReportRepository from "../repositories/ReportRepository";

export const getAllReports = async (): Promise<Report[]> => {
  return await ReportRepository.getAllReports();
};

export const updateReportStatus = async (id: number, status: string) => {
  return await ReportRepository.updateReportStatus(id, status);
};

export const getReportById = async (id: number) => {
  return await ReportRepository.getReportById(id);
};