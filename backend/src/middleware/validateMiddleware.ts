import { ZodSchema } from "zod";
import AppError from "../utils/AppError";

export const validate =
	(schema: ZodSchema) => (req: any, _res: any, next: any) => {
		try {
			req.validatedBody = schema.parse(req.body);
			next();
		} catch (err: any) {
			const message =
				err.issues
					?.map((e: any) => `${e.path.join(".")}: ${e.message}`)
					.join(", ") || "Invalid input";
			next(new AppError(message, 400));
		}
	};
