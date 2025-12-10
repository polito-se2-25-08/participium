import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { verifyToken } from "../utils/jwt";
import type { DbRole } from "../utils/roleMapper";

export const protect = (req: Request, _res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	// Check if authorization header exists
	if (!authHeader) {
		return next(new AppError("Not authorized, token missing", 401));
	}

	// Check if it contains "Bearer"
	if (!authHeader.includes("Bearer")) {
		return next(new AppError("Not authorized, token missing", 401));
	}

	// Check if it starts with "Bearer " (with space)
	if (!authHeader.startsWith("Bearer ")) {
		return next(new AppError("Invalid or expired token", 401));
	}

	const token = authHeader.split(" ")[1];

	// Check if token exists after split
	if (!token) {
		return next(new AppError("Invalid or expired token", 401));
	}

	try {
		const decoded = verifyToken(token);
		(req as any).user = decoded; // attach decoded payload to request
		next();
	} catch {
		next(new AppError("Invalid or expired token", 401));
	}
};

/**
 * Middleware to restrict access to specific roles
 * Must be used after the `protect` middleware
 * @param allowedRoles - Array of roles allowed to access the endpoint
 */
export const restrictTo = (...allowedRoles: DbRole[]) => {
	return (req: Request, _res: Response, next: NextFunction) => {
		const user = (req as any).user;

		if (!user || !user.role) {
			return next(new AppError("User information not found", 401));
		}

		if (!allowedRoles.includes(user.role)) {
			return next(
				new AppError(
					"You do not have permission to perform this action",
					403
				)
			);
		}

		next();
	};
};
