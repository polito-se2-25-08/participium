import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

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
