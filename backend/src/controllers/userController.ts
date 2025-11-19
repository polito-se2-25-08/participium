import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { userService } from "../services/userService";

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
		success: true,
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
		success: true,
		data: {
			user: {
				id: user.id,
				name: user.name,
				surname: user.surname,
				email: user.email,
				username: user.username,
				role: user.role,
			},
			token: token,
		},
	});
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const users = await userService.getAllUsers();

	res.status(200).json({
		success: true,
		results: users.length,
		data: users,
	});
});
