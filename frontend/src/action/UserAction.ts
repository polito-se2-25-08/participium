import type { LoginReponse } from "../interfaces/dto/login/LoginResponse";
import type { RegisterResponse } from "../interfaces/dto/register/RegisterResponse";
import type { ApiResponse } from "../interfaces/dto/Response";
import type { User } from "../interfaces/dto/user/User";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const loginAction = async (
	_: unknown,
	formData: FormData
): Promise<ApiResponse<LoginReponse>> => {
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	try {
		const res = await fetch(`${API_ENDPOINT}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error("Login error response:", errorText);
			return {
				success: false,
				data: { message: `Login failed: ${res.status}` },
			};
		}

		const result: ApiResponse<LoginReponse> = await res.json();
		return result;
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Cannot reach server";
		return { success: false, data: { message: message } };
	}
};

export const registerAction = async (
	_: unknown,
	formData: FormData
): Promise<ApiResponse<RegisterResponse>> => {
	const name = formData.get("name") as string;
	const surname = formData.get("surname") as string;
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;
	const email = formData.get("email") as string;

	try {
		const res = await fetch(`${API_ENDPOINT}/v1/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				surname,
				username,
				password,
				email,
			}),
		});

		const result: ApiResponse<RegisterResponse> = await res.json();

		return result;
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Cannot reach server";
		return { success: false, data: { message: message } };
	}
};

export const updateUserAction = async (
	_: unknown,
	formData: FormData
): Promise<ApiResponse<User>> => {
	try {
		const userIdValue = formData.get("user_id");
		const userId = Number(userIdValue);

		const bodyObj: Record<string, unknown> = {};

		const emailNotificationValue = formData.get("email_notification");
		if (emailNotificationValue !== null) {
			bodyObj.emailNotification = emailNotificationValue === "on";
		}

		const telegramUsernameValue = formData.get("telegram_username");
		if (telegramUsernameValue !== null && telegramUsernameValue !== "") {
			bodyObj.telegramUsername = telegramUsernameValue;
		}

		const profilePictureValue = formData.get("profile_picture");
		if (profilePictureValue !== null && profilePictureValue !== "") {
			bodyObj.profilePicture = profilePictureValue;
		}

		const body = JSON.stringify(bodyObj);

		const res = await fetch(`${API_ENDPOINT}/users/${userId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body,
		});

		const result: ApiResponse<User> = await res.json();
		return result;
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Cannot reach server";
		return { success: false, data: { message: message } };
	}
};
