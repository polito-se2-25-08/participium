import {
	generateSalt,
	hashPassword,
	verifyPassword,
} from "../utils/encryption";
import { UpdateUserRow, userRepository } from "../repositories/userRepository";
import AppError from "../utils/AppError";
import { TablesInsert } from "../utils/DatabaseSchema";
import { signToken } from "../utils/jwt";
import { User } from "@supabase/supabase-js";
import { toSnakeCase } from "../utils/ToSnakeCase";

export const userService = {
	async registerUser(data: {
		email: string;
		username: string;
		password: string;
		name: string;
		surname: string;
		telegram_username?: string | null;
	}) {
		const existing = await userRepository.findByUsername(data.username);
		if (existing) throw new AppError("Username taken", 400);

		const salt = generateSalt();
		const hashedPassword = hashPassword(data.password, salt);

		const newUser: TablesInsert<"User"> = {
			email: data.email,
			username: data.username,
			password: hashedPassword,
			salt,
			name: data.name,
			surname: data.surname,
			role: "CITIZEN",
			profile_picture: null,
			email_notification: null,
			telegram_username: data.telegram_username ?? null,
		};

		const createdUser = await userRepository.createUser(newUser);
		return createdUser;
	},

	async loginUser(username: string, password: string) {
		const user = await userRepository.findByUsername(username);
		if (!user) throw new AppError("User doesn't exist", 401);

		const valid = verifyPassword(password, user.salt, user.password);
		if (!valid) throw new AppError("Invalid password", 401);

		// Generate JWT
		const token = signToken({ id: user.id, role: user.role });

		return { user, token };
	},

	async getAllUsers() {
		return await userRepository.getAllUsers();
	},

	async getUserById(userId: number) {
		const user = await userRepository.findById(userId);
		if (!user) throw new AppError("User not found", 404);
		return user;
	},

	async updateUser(userId: number, data: Partial<any>): Promise<any> {
		const snakeCaseData = toSnakeCase(data);
		const user = await userRepository.updateUser(userId, snakeCaseData);
		return user;
	},
};
