import {
	ReportMessage,
	ReportMessageDTO,
	ReportMessageInsert,
} from "../models/ReportMessage";
import * as ReportMessageRepository from "../repositories/ReportMessageRepository";
import * as NotificationService from "./NotificationService";
import * as ReportRepository from "../repositories/ReportRepository";

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

	/*
	const notification = await NotificationService.createNotification(
		 senderId,
		 reportId,
		 "NEW_MESSAGE",
		`New message on report #${report_id}`,
	);

	*/

	return savedMessageCamelCase;
};

export const getMessagesByReportId = async (
	reportId: number
): Promise<ReportMessage[]> => {
	return await ReportMessageRepository.getMessagesByReportId(reportId);
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

	/*
	const notification = await NotificationService.createNotification(
		 senderId,
		 reportId,
		 "NEW_MESSAGE",
		`New message on report #${report_id}`,
	);

	*/

	return savedMessage;
};
