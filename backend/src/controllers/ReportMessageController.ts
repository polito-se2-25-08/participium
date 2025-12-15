import { Request, Response } from "express";
import * as ReportMessageService from "../services/ReportMessageService";
import * as ReportService from "../services/ReportService";
import { ApiResponse, ReportDTO } from "../dto/ReportDTO";
import { ReportMessage } from "../models/ReportMessage";

export const sendPublicMessage = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { message, senderId } = req.body;
		const reportId = Number(id);

		if (Number.isNaN(reportId) || !message || !senderId) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Invalid report ID or message or sender ID",
			};
			return res.status(400).json(response);
		}

		const savedMessage = await ReportMessageService.createPublicMessage(
			reportId,
			senderId,
			message
		);

		const response: ApiResponse<ReportMessage> = {
			success: true,
			data: savedMessage,
		};
		return res.status(201).json(response);
	} catch (err: any) {
		console.error("Error sending message:", err);
		const response: ApiResponse<string> = {
			success: false,
			data: err.message || "Unknown error occurred",
		};
		return res.status(500).json(response);
	}
};

export const sendInternalMessage = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { message, senderId } = req.body;
		const reportId = Number(id);

		if (Number.isNaN(reportId) || !message || !senderId) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Invalid report ID or message or sender ID",
			};
			return res.status(400).json(response);
		}

		const savedMessage = await ReportMessageService.createInternalMessage(
			reportId,
			senderId,
			message
		);

		const response: ApiResponse<ReportMessage> = {
			success: true,
			data: savedMessage,
		};
		return res.status(201).json(response);
	} catch (err: any) {
		console.error("Error sending message:", err);
		const response: ApiResponse<string> = {
			success: false,
			data: err.message || "Unknown error occurred",
		};
		return res.status(500).json(response);
	}
};

export const getMessages = async (req: Request, res: Response) => {
	try {
		const { id } = req.params; // report_id
		const numericId = Number(id);

		if (Number.isNaN(numericId)) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Invalid report ID",
			};
			return res.status(400).json(response);
		}

		const messages = await ReportMessageService.getMessagesByReportId(
			numericId
		);
		const response: ApiResponse<ReportMessage[]> = {
			success: true,
			data: messages,
		};
		return res.status(200).json(response);
	} catch (err: any) {
		console.error("Error fetching messages:", err);
		const response: ApiResponse<string> = {
			success: false,
			data: err.message || "Unknown error occurred",
		};
		return res.status(500).json(response);
	}
};

export const getPendingReports = async (req: Request, res: Response) => {
	try {
		const pendingReports = await ReportService.getPendingReports();
		const response: ApiResponse<ReportDTO[]> = {
			success: true,
			data: pendingReports,
		};
		return res.status(200).json(response);
	} catch (err: any) {
		console.error("Error fetching pending reports:", err);
		const response: ApiResponse<string> = {
			success: false,
			data: err.message || "Unknown error occurred",
		};
		return res.status(500).json(response);
	}
};
