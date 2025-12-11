import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { externalCompanyService } from "../services/ExternalCompanyService";


export const getAllExternalCompanies = catchAsync(async (req: Request, res: Response) => {
const companies = await externalCompanyService.getAllCompanies();
res.status(200).json({ success: true, results: companies.length, data: companies });
});


export const getExternalCompanyById = catchAsync(async (req: Request, res: Response) => {
const id = Number.parseInt(req.params.id);


if (Number.isNaN(id)) {
throw new AppError("Invalid company ID", 400, "INVALID_ID");
}


const company = await externalCompanyService.getCompanyById(id);
res.status(200).json({ success: true, data: company });
});


export const getExternalCompaniesByCategory = catchAsync(async (req: Request, res: Response) => {
const categoryId = Number.parseInt(req.params.categoryId);


if (Number.isNaN(categoryId)) {
throw new AppError("Invalid category ID", 400, "INVALID_ID");
}


const companies = await externalCompanyService.getCompaniesByCategory(categoryId);
res.status(200).json({ success: true, results: companies.length, data: companies });
});