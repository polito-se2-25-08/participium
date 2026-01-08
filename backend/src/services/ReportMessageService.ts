import {
  ReportMessage,
  ReportMessageDTO,
} from "../models/ReportMessage";
import * as ReportMessageRepository from "../repositories/ReportMessageRepository";
import * as ReportRepository from "../repositories/ReportRepository";
import { sendNotification } from "../utils/notificationHelper";

export const createPublicMessage = async (
  reportId: number,
  senderId: number,
  message: string
): Promise<ReportMessageDTO> => {
  const trimmedMessage = message.trim();

  if (trimmedMessage === "") {
    throw new Error("Message cannot be empty");
  }

  const report = await ReportRepository.getReportById(reportId);

  if (!report) {
    throw new Error("Report not found");
  }

  const savedMessage = await ReportMessageRepository.createPublicMessage(
    reportId,
    senderId,
    trimmedMessage
  );

  const savedMessageCamelCase = {
    id: savedMessage.id,
    reportId: savedMessage.report_id,
    senderId: savedMessage.sender_id,
    message: savedMessage.message,
    createdAt: savedMessage.created_at,
    isPublic: savedMessage.is_public,
  };

  if (!savedMessage) {
    throw new Error("Failed to save message");
  }
  // Notify the report owner about the new message using unified helper
  await sendNotification({
    userId: report.user_id,
    reportId,
    type: "NEW_MESSAGE",
    message: `New message on report "${report.title}"`,
    additionalData: {
      reportTitle: report.title,
      messagePreview: trimmedMessage.substring(0, 50),
    },
  });

  return savedMessageCamelCase;
};

export const getMessagesByReportId = async (
  reportId: number
): Promise<ReportMessage[]> => {
  return await ReportMessageRepository.getPublicMessagesByReportId(reportId);
};

export const createInternalMessage = async (
  reportId: number,
  senderId: number,
  message: string
): Promise<ReportMessage> => {
  const trimmedMessage = message.trim();

  if (trimmedMessage === "") {
    throw new Error("Message cannot be empty");
  }

  const report = await ReportRepository.getReportById(reportId);

  if (!report) {
    throw new Error("Report not found");
  }

  const savedMessage = await ReportMessageRepository.createInternalMessage(
    reportId,
    senderId,
    trimmedMessage
  );

  if (!savedMessage) {
    throw new Error("Failed to save message");
  }

  return savedMessage;
};

export const getInternalMessagesByReportId = async (
  reportId: number
): Promise<ReportMessage[]> => {
  return await ReportMessageRepository.getInternalMessagesByReportId(reportId);
};
