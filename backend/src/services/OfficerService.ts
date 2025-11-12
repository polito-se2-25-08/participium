import { Report } from "../models/Report";
import * as ReportRepository from "../repositories/ReportRepository";

export const getAllReports = async (): Promise<Report[]> => {
	return await ReportRepository.getAllReports();
};
