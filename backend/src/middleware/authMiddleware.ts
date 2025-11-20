import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { verifyToken } from "../utils/jwt";
import type { DbRole } from "../utils/roleMapper";

export const protect = (req: Request, _res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return next(new AppError("Not authorized, token missing", 401));
	}

	const token = authHeader.split(" ")[1];
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
				new AppError("You do not have permission to perform this action", 403)
			);
		}

		next();
	};
};
