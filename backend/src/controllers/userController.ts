import { Request, Response } from "express";
import { userService } from "../services/userService";
import { catchAsync } from "../utils/catchAsync";

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { email, username, password, name, surname } = req.body;
  const user = await userService.registerUser({
    email,
    username,
    password,
    name,
    surname,
  });

  res.status(201).json({
    status: "success",
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { user, token } = await userService.loginUser(username, password);

  res.status(200).json({
    status: "success",
    token,
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: users,
  });
});

