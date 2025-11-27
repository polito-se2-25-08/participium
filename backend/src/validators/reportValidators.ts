import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description too long"),
  category: z.string().min(1, "Category is required"),
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
  address: z.string().min(5, "Address is required"),
  anonymous: z.boolean(),
  user_id: z.number().optional(),
  photos: z.array(z.string()).min(1, "At least 1 photo is required").max(3, "Maximum 3 photos allowed"),
});

export const rejectReportSchema = z.object({
  motivation: z.string()
    .min(10, "Rejection motivation must be at least 10 characters")
    .max(500, "Rejection motivation is too long")
    .transform(str => str.trim()),
});
