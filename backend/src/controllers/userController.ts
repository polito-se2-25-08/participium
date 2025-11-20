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

/**
 * Get a single user by ID
 * Admin-only endpoint
 */
export const getUserById = catchAsync(async (req: Request, res: Response) => {
	const userId = parseInt(req.params.id, 10);
	
	if (isNaN(userId)) {
		res.status(400).json({
			status: "error",
			message: "Invalid user ID",
		});
		return;
	}

	const user = await userService.getUserById(userId);

	res.status(200).json({
		status: "success",
		data: user,
	});
});

/**
 * Assign or update a user's role
 * Admin-only endpoint
 * Accepts DB roles: CITIZEN, ADMIN, OFFICER, TECHNICIAN
 */
export const assignRole = catchAsync(async (req: Request, res: Response) => {
	const userId = parseInt(req.params.id, 10);
	const { role } = req.body;

	if (isNaN(userId)) {
		res.status(400).json({
			status: "error",
			message: "Invalid user ID",
		});
		return;
	}

	const updatedUser = await userService.updateUserRole(userId, role);

	res.status(200).json({
		status: "success",
		message: "Role updated successfully",
		data: {
			id: updatedUser.id,
			username: updatedUser.username,
			email: updatedUser.email,
			role: updatedUser.role,
		},
	});
});
