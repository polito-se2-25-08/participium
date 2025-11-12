import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?\":{}|<>]/, "Password must contain at least one special character")
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

export const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
