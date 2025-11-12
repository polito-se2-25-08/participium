import { Request, Response } from "express";
import { adminService } from "../services/AdminService";
import { catchAsync } from "../utils/catchAsync";
export const setupUser = catchAsync(async (req: Request, res: Response) => {
  const { email, username, role, name, surname } = req.body;
  const user = await adminService.createUser({
    email,
    username,
    role,
    name,
    surname,
  });

  res.status(201).json({
    status: "success",
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
    },
  });
});