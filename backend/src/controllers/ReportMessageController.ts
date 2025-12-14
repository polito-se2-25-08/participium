import { Request, Response } from "express";
import * as ReportMessageService from "../services/ReportMessageService";
import * as ReportService from "../services/ReportService";
import { ApiResponse, ReportDTO } from "../dto/ReportDTO";
import { ReportMessage } from "../models/ReportMessage";
import { supabase } from "../utils/Supabase";

export const sendMessage = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { message, senderId } = req.body;
		const numericId = Number(id);

		if (Number.isNaN(numericId)) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Invalid report ID",
			};
			return res.status(400).json(response);
		}

		if (!message || message.trim() === "") {
			const response: ApiResponse<string> = {
				success: false,
				data: "Message is required",
			};
			return res.status(400).json(response);
		}

		if (!senderId) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Authentication required",
			};
			return res.status(401).json(response);
		}

		// Get the report to find the recipient
		const { data: report, error: reportError } = await supabase
			.from("Report")
			.select("user_id")
			.eq("id", numericId)
			.single();

		if (reportError || !report) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Report not found",
			};
			return res.status(404).json(response);
		}

		// Determine recipient (if sender is report owner, recipient is technician, and vice versa)
		// For now, we'll assume the recipient is the report owner if sender is different
		const recipientId =
			report.user_id === senderId ? senderId : report.user_id;

		const savedMessage = await ReportMessageService.createMessage(
			{
				report_id: numericId,
				sender_id: senderId,
				message: message.trim(),
			},
			recipientId
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
