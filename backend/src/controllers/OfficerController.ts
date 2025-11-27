import { Report } from "../models/Report";
import * as OfficerService from "../services/OfficerService";
import { Request, Response } from "express";
import { rejectReportSchema } from "../validators/reportValidators";

export const getAllReports = async (req: Request, res: Response) => {
	try {
		const reports: Report[] = await OfficerService.getAllReports();
		return res.status(200).json({
			success: true,
			data: reports
		});
	} catch (err: any) {
		console.error("Error fetching reports:", err);
		return res.status(500).json({
			success: false,
			data: err.message || "Failed to fetch reports"
		});
	}
};

export const updateReportStatus = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const numericId = Number(id);

		const report = await OfficerService.updateReportStatus(
			numericId,
			status
		);
		return res.status(200).json({
			success: true,
			data: report
		});
	} catch (err: any) {
		console.error("Error updating report status:", err);
		return res.status(500).json({
			success: false,
			data: err.message || "Failed to update report status"
		});
	}
};

export const getReportById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const numericId = Number(id);

		const report = await OfficerService.getReportById(numericId);
		return res.status(200).json({
			success: true,
			data: report
		});
	} catch (err: any) {
		console.error("Error fetching report:", err);
		return res.status(500).json({
			success: false,
			data: err.message || "Failed to fetch report"
		});
	}
};

export const approveReport = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const numericId = Number(id);

		if (isNaN(numericId)) {
			return res.status(400).json({
				success: false,
				data: "Invalid report ID"
			});
		}

		const report = await OfficerService.approveReport(numericId);
		return res.status(200).json({
			success: true,
			data: report
		});
	} catch (err: any) {
		console.error("Error approving report:", err);
		return res.status(500).json({
			success: false,
			data: err.message || "Unknown error occurred"
		});
	}
};

export const rejectReport = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const numericId = Number(id);

		if (isNaN(numericId)) {
			return res.status(400).json({
				success: false,
				data: "Invalid report ID"
			});
		}

		// Validate request body with Zod
		const validationResult = rejectReportSchema.safeParse(req.body);
		
		if (!validationResult.success) {
			return res.status(400).json({
				success: false,
				data: validationResult.error.issues[0].message
			});
		}

		const { motivation } = validationResult.data;

		const report = await OfficerService.rejectReport(numericId, motivation);
		return res.status(200).json({
			success: true,
			data: report
		});
	} catch (err: any) {
		console.error("Error rejecting report:", err);
		return res.status(500).json({
			success: false,
			data: err.message || "Unknown error occurred"
		});
	}
};
