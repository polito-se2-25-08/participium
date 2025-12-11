import { UserReportDTO } from "../controllers/interface/UserReports";
import { mapMessageDBToMessage } from "../controllers/mapper/MessageDBToMessage";
import { mapReportsToReportsDTO } from "../controllers/mapper/ReportMapper";
import { ActiveReportDTO } from "../dto/ActiveReport";
import { Report, ReportInsert } from "../models/Report";
import { MessageRepository } from "../repositories/MessageRepository";
import * as ReportRepository from "../repositories/ReportRepository";
import * as NotificationService from "./NotificationService";

export const createReport = async (
	reportData: ReportInsert & { photos: string[] }
): Promise<Report> => {
	return await ReportRepository.createReport(reportData);
};

export const getAllReports = async (
	userRole: string = "CITIZEN"
): Promise<Report[]> => {
	return await ReportRepository.getAllReports(userRole);
};

export const getReportById = async (
	id: number,
	userRole: string = "CITIZEN"
): Promise<Report> => {
	return await ReportRepository.getReportById(id, userRole);
};

export const getActiveReports = async (
	userRole: string = "CITIZEN"
): Promise<ActiveReportDTO[]> => {
	return await ReportRepository.getActiveReports(userRole);
};

export const getFilteredReports = async (
	userId: string,
	category: string[],
	status: string[],
	reportsFrom: string,
	reportsUntil: string,
	userRole: string = "CITIZEN"
): Promise<Report[]> => {
	return await ReportRepository.getFilteredReports(
		userId,
		category,
		status,
		reportsFrom,
		reportsUntil,
		userRole
	);
};

export const approveReport = async (id: number): Promise<Report> => {
	return await ReportRepository.approveReport(id);
};

export const rejectReport = async (
	id: number,
	motivation: string,
	officer_id: number
): Promise<Report> => {
	return await ReportRepository.rejectReport(id, motivation);
};

export const updateReportStatus = async (
	id: number,
	status: string,
	userId: number
) => {
	const report = await ReportRepository.updateReportStatus(id, status);

	// Create notification for the report owner
	await NotificationService.createNotification({
		user_id: userId,
		report_id: id,
		type: "STATUS_UPDATE",
		message: `Your report #${id} status has been updated to: ${status}`,
	});

	return report;
};

export const getReportsByUserId = async (
	userId: number
): Promise<UserReportDTO[]> => {
	const reports = await ReportRepository.getReportsByUserId(userId);

	const mappedReports = mapReportsToReportsDTO(reports);

	return mappedReports;
};
