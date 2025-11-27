import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

// Supabase errors structure:
// { message: "duplicate key value violates unique constraint", details: "...", hint: "...", code: "23505" }

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error("❌ Error:", err);

	let statusCode = err.statusCode || 500;
	let message = err.message || "Something went wrong on the server.";
	let code = err.code || "INTERNAL_ERROR";

	//  Handle Supabase Postgres errors (using code or message)
	if (err.code) {
		switch (err.code) {
			case "23505": // unique constraint violation
				statusCode = 400;
				message = "Duplicate value for a field that must be unique.";
				code = "SUPABASE_DUPLICATE";
				break;
			case "23503": // foreign key violation
				statusCode = 400;
				message = "Invalid reference to another record.";
				code = "SUPABASE_FK_VIOLATION";
				break;
			case "22P02": // invalid input syntax (e.g. UUID error)
				statusCode = 400;
				message = "Invalid input format.";
				code = "SUPABASE_INVALID_INPUT";
				break;
			default:
				if (err.message?.includes("duplicate key")) {
					statusCode = 400;
					code = "SUPABASE_DUPLICATE";
				}
		}
	}

	// 🧩 Handle validation errors
	if (err.name === "ZodError") {
		statusCode = 400;
		message = "Validation failed.";
		code = "VALIDATION_ERROR";
		return res.status(statusCode).json({
			success: false,
			message,
			code,
			errors: err.errors.map((e: any) => ({
				path: e.path.join("."),
				message: e.message,
			})),
		});
	}

	//  Handle operational (custom) errors
	if (err instanceof AppError && err.isOperational) {
		return res.status(statusCode).json({
			success: false,
			message,
			code,
			statusCode,
		});
	}

	//  Unknown or programming errors
	if (process.env.NODE_ENV === "development") {
		return res.status(statusCode).json({
			success: false,
			message,
			code,
			stack: err.stack,
			details: err.details,
		});
	}

	// 🧩 Production fallback
	res.status(500).json({
		success: false,
		message: "Internal server error",
		code: "INTERNAL_ERROR",
	});
};
