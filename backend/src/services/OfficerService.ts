import { Report } from "../models/Report";
import * as ReportRepository from "../repositories/ReportRepository";
import { sendNotification } from "../utils/notificationHelper";

export const getAllReports = async (): Promise<Report[]> => {
  const reports = await ReportRepository.getAllReports();
  // Type assertion if needed, or handle the ReportDB to Report conversion
  return reports as any as Report[];
};

export const updateReportStatus = async (id: number, status: string) => {
  const report = await ReportRepository.updateReportStatus(id, status);

  // Notify the report owner about the status change
  await sendNotification({
    userId: report.user_id,
    reportId: id,
    type: "STATUS_UPDATE",
    message: `Your report "${report.title}" status has been updated to: ${status}`,
    additionalData: {
      status,
      reportTitle: report.title,
    },
  });

  return report;
};

export const getReportById = async (id: number) => {
  return await ReportRepository.getReportById(id, "OFFICER");
};

export const approveReport = async (id: number): Promise<Report> => {
  const report = await ReportRepository.approveReport(id);

  // Notify the report owner that their report has been approved
  await sendNotification({
    userId: report.user_id,
    reportId: id,
    type: "STATUS_UPDATE",
    message: `Your report "${report.title}" has been approved and assigned`,
    additionalData: {
      status: "ASSIGNED",
      reportTitle: report.title,
    },
  });
  return report;
};

export const rejectReport = async (
  id: number,
  motivation: string
): Promise<Report> => {
  const report = await ReportRepository.rejectReport(id, motivation);

  await sendNotification({
    userId: report.user_id,
    reportId: id,
    type: "STATUS_UPDATE",
    message: `Your report "${report.title}" has been rejected. \nReason: ${motivation}`,
    additionalData: {
      status: "REJECTED",
      reportTitle: report.title,
      motivation,
    },
  });
  return report;
};
