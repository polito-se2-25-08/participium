import { Request, Response } from "express";
import * as ReportService from "../services/ReportService";
import * as TechnicianService from "../services/TechnicianService";
import { ApiResponse, CreateReportDTO } from "../dto/ReportDTO";
import { Report } from "../models/Report";
import { getCategoryId } from "../utils/categoryMapper";
import { io, connectedUsers } from "../app";
import { supabase } from "../utils/Supabase";

import { ActiveReportDTO } from "../dto/ActiveReport";

export const createReport = async (req: Request, res: Response) => {
	try {
		const reportData: CreateReportDTO = req.body;

		// Convert category name to ID
		const category_id = getCategoryId(reportData.category);

		// Extract user_id from JWT (protect middleware ensures this exists)
		const authenticatedUser = (req as any).user;
		const user_id = authenticatedUser?.id;

		if (!user_id) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Authentication required",
			};
			return res.status(401).json(response);
		}

		const report = await ReportService.createReport({
			title: reportData.title,
			description: reportData.description,
			category_id,
			latitude: reportData.latitude.toString(),
			longitude: reportData.longitude.toString(),
			anonymous: reportData.anonymous,
			user_id,
			timestamp: new Date().toISOString(),
			photos: reportData.photos,
		});

		const response: ApiResponse<Report> = {
			success: true,
			data: report,
		};

		return res.status(201).json(response);
	} catch (err: any) {
		console.error("Error creating report:", err);
		const response: ApiResponse<string> = {
			success: false,
			data: err.message || "Unknown error occurred",
		};
		return res.status(500).json(response);
	}
};

export const getAllReports = async (req: Request, res: Response) => {
	try {
		const reports = await ReportService.getAllReports();
		const response: ApiResponse<Report[]> = {
			success: true,
			data: reports,
		};
		return res.status(200).json(response);
	} catch (err) {
		console.error("Error fetching reports:", err);
		const response: ApiResponse<null> = {
			success: false,
			data: null,
		};
		return res.status(500).json(response);
	}
};

export const getReportById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const numericId = Number(id);

		if (isNaN(numericId)) {
			const response: ApiResponse<null> = {
				success: false,
				data: null,
			};
			return res.status(400).json(response);
		}

		const report = await ReportService.getReportById(numericId);
		const response: ApiResponse<Report> = {
			success: true,
			data: report,
		};
		return res.status(200).json(response);
	} catch (err) {
		console.error("Error fetching report:", err);
		const response: ApiResponse<null> = {
			success: false,
			data: null,
		};
		return res.status(500).json(response);
	}
};

export const getActiveReports = async (req: Request, res: Response) => {
	try {
		const reports = await ReportService.getActiveReports();
		const response: ApiResponse<ActiveReportDTO[]> = {
			success: true,
			data: reports,
		};
		return res.status(200).json(response);
	} catch (err) {
		console.error("Error fetching active reports:", err);
		const response: ApiResponse<null> = {
			success: false,
			data: null,
		};
		return res.status(500).json(response);
	}
};

export const getFilteredReports = async (req: Request, res: Response) => {
	try {
		const { userId, category, status, reportsFrom, reportsUntil } =
			req.query;

		const categoryArray = category
			? Array.isArray(category)
				? (category as string[])
				: [category as string]
			: [];

		const statusArray = status
			? Array.isArray(status)
				? (status as string[])
				: [status as string]
			: [];

		const reports = await ReportService.getFilteredReports(
			userId as string,
			categoryArray,
			statusArray,
			reportsFrom as string,
			reportsUntil as string
		);

		const response: ApiResponse<Report[]> = {
			success: true,
			data: reports,
		};
		return res.status(200).json(response);
	} catch (err) {
		console.error("Error fetching filtered reports:", err);
		const response: ApiResponse<null> = {
			success: false,
			data: null,
		};
		return res.status(500).json(response);
	}
};

export const approveReport = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const numericId = Number(id);

		if (isNaN(numericId)) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Invalid report ID",
			};
			return res.status(400).json(response);
		}

		const report = await ReportService.approveReport(numericId);
		const response: ApiResponse<Report> = {
			success: true,
			data: report,
		};
		return res.status(200).json(response);
	} catch (err: any) {
		console.error("Error approving report:", err);
		const response: ApiResponse<string> = {
			success: false,
			data: err.message || "Unknown error occurred",
		};
		return res.status(500).json(response);
	}
};

export const rejectReport = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { motivation } = req.body;
		const numericId = Number(id);

		if (isNaN(numericId)) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Invalid report ID",
			};
			return res.status(400).json(response);
		}

		if (!motivation || motivation.trim() === "") {
			const response: ApiResponse<string> = {
				success: false,
				data: "Rejection motivation is required",
			};
			return res.status(400).json(response);
		}

		const authenticatedUser = (req as any).user;
		const officer_id = authenticatedUser?.id;

		if (!officer_id) {
			const response: ApiResponse<string> = {
				success: false,
				data: "Authentication required",
			};
			return res.status(401).json(response);
		}

		const report = await ReportService.rejectReport(
			numericId,
			motivation,
			officer_id
		);
		const response: ApiResponse<Report> = {
			success: true,
			data: report,
		};
		return res.status(200).json(response);
	} catch (err: any) {
		console.error("Error rejecting report:", err);
		const response: ApiResponse<string> = {
			success: false,
			data: err.message || "Unknown error occurred",
		};
		return res.status(500).json(response);
	}
};

export const updateReportStatus = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const numericId = Number(id);
		if (isNaN(numericId)) {
			return res.status(400).json({
				success: false,
				data: "Invalid report ID",
			});
		}

		if (!status) {
			return res.status(400).json({
				success: false,
				data: "Status is required",
			});
		}

		// Validate status value
		const validStatuses = ["ASSIGNED", "IN_PROGRESS", "SUSPENDED", "RESOLVED"];
		if (!validStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				data: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
			});
		}

		// Get authenticated technician
		const authenticatedUser = (req as any).user;
		if (!authenticatedUser?.id) {
			return res.status(401).json({
				success: false,
				data: "Authentication required",
			});
		}

		// Check if technician is authorized to update this report
		const canUpdate = await TechnicianService.canTechnicianUpdateReport(
			authenticatedUser.id,
			numericId
		);

		if (!canUpdate) {
			return res.status(403).json({
				success: false,
				data: "You are not authorized to update this report. It does not belong to your category.",
			});
		}

		// Fetch user_id AND title to include in notification
		const { data: rawReport, error: fetchError } = await supabase
			.from("Report")
			.select("user_id, title")
			.eq("id", numericId)
			.single();

		if (fetchError || !rawReport) {
			return res.status(404).json({
				success: false,
				data: "Report not found",
			});
		}

		const userId = rawReport.user_id;
		const reportTitle = rawReport.title;

		// Update the report status and create notification in DB
		const updatedReport = await ReportService.updateReportStatus(
			numericId,
			status,
			userId
		);

		// Try to send via WebSocket if user is online
		const socketId = connectedUsers.get(userId);

		if (socketId) {
			io.to(socketId).emit("notification", {
				message: `Your report "${reportTitle}" status has been updated to: ${status}`,
				reportId: numericId,
				reportTitle, // <--- new field
				status,
				timestamp: new Date().toISOString(),
			});

			console.log(
				`Notification sent to user ${userId} for report ${numericId}`
			);
		} else {
			console.log(
				`User ${userId} is not connected, notification saved to DB`
			);
		}

		return res.status(200).json({
			success: true,
			data: updatedReport,
		});
	} catch (err: any) {
		console.error("Error updating report status:", err);
		return res.status(500).json({
			success: false,
			data: err.message || "Unknown error",
		});
	}
};

export const getReportsByUserId = async (req: Request, res: Response) => {
	const { id } = req.params;
	const numericId = Number(id);

	const reports = await ReportService.getReportsByUserId(numericId);

	return res.status(200).json({
		success: true,
		data: reports,
	});
};
