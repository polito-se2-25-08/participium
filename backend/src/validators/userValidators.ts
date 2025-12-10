import { z } from "zod";
import { isValidRole } from "../utils/roleMapper";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?\":{}|<>]/,
      "Password must contain at least one special character"
    )
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
});

export const setupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4, "Username must be at least 4 characters"),
  role: z.string().min(1, "Role is required"),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
});

export const setupTechnicianSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4, "Username must be at least 4 characters"),
  role: z.string().min(1, "Role is required"),
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  category_ids: z.array(z.union([z.string(), z.number()])).optional(),
});
/* 
export const updateTechnicianCategoriesSchema = z.object({
  category_ids: z.array(z.union([z.string(), z.number()])),
});
 */
export const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Schema for assigning/updating a user's role
export const assignRoleSchema = z.object({
  role: z.string().min(1, "Role is required").refine(isValidRole, {
    message:
      "Invalid role. Must be one of: CITIZEN, ADMIN, OFFICER, TECHNICIAN",
  }),
});
