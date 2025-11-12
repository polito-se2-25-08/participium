import { Report } from "../models/Report";
import * as OfficerService from "../services/OfficerService";
import { Request, Response } from "express";

export const getAllReports = async (req: Request, res: Response) => {
	try {
		const reports: Report[] = await OfficerService.getAllReports();
		return res.status(200).json(reports);
	} catch (err) {
		console.log(err);
	}
};
