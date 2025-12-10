import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { userService } from "../services/userService";
import { getVerificationCode, InitializeVerificationCode } from "../repositories/VerificationCodeRepository";
import { userRepository } from "../repositories/userRepository";

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
				profilePicture: user.profile_picture,
				emailNotification: user.email_notification,
				telegramUsername: user.telegram_username,
				isVerified: user.isVerified,
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
			success: false,
			message: "Invalid user ID",
		});
		return;
	}

	const user = await userService.getUserById(userId);

	res.status(200).json({
		success: true,
		data: user,
	});
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
	const userId = parseInt(req.params.id);

	if (isNaN(userId)) {
		res.status(400).json({
			success: false,
			data: {
				message: "Invalid user ID",
			},
		});
		return;
	}

	const updatedUser = await userService.updateUser(userId, req.body);

	res.status(200).json({
		success: true,
		data: {
			id: updatedUser.id,
			username: updatedUser.username,
			email: updatedUser.email,
			role: updatedUser.role,
			telegramUsername: updatedUser.telegram_username,
			emailNotification: updatedUser.email_notification,
			profilePicture: updatedUser.profile_picture,
		},
	});
});

export const verifyUser = catchAsync(async (req: Request, res: Response) => {
	const userId = parseInt(req.params.id);
	const code = req.query.code as string;

	if (isNaN(userId) || !code) {
		res.status(400).json({
			success: false,
			message: "Invalid user ID or missing code",
		});
		return;
	}
	const verificationCode = await getVerificationCode(userId);
  	if(verificationCode !== null && code === verificationCode)
	{
		await userRepository.verifyUser(userId);
		res.status(200).json({
			success: true,
			data: {
				result: true,
			},
		});
	}
	else if(verificationCode !== null && code !== verificationCode)
	{
		res.status(200).json({
			success: true,
			data: {
				result: false,
			},
		});
	}
});

export const createVerificationCode = catchAsync(async (req: Request, res: Response) => {
	const userId = parseInt(req.params.id);

	if (isNaN(userId)) {
		res.status(400).json({
			success: false,
			message: "Invalid user ID",
		});
		return;
	}
	await InitializeVerificationCode(userId);

	res.status(201).json({
		success: true,
		message: "Verification code created and sent via email",
	});
});
