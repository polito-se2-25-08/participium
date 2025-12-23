import type { LoginReponse } from "../interfaces/dto/login/LoginResponse";
import type { RegisterResponse } from "../interfaces/dto/register/RegisterResponse";
import type { UserReport } from "../interfaces/dto/report/UserReport";
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
): Promise<ApiResponse<LoginReponse>> => {
	const name = formData.get("name") as string;
	const surname = formData.get("surname") as string;
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;
	const email = formData.get("email") as string;

	try {
		const res = await fetch(`${API_ENDPOINT}/register`, {
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
		
		if (!res.ok) {
			const errorText = await res.text();
			console.error("Register error response:", errorText);
			return {
				success: false,
				data: { message: `Registration failed: ${res.status}` },
			};
		}

		const registerResult: ApiResponse<RegisterResponse> = await res.json();
		if (!registerResult.success) {
			return { success: false, data: { message: registerResult.data.message || "Registration failed" } };
		}

		// After successful registration, automatically log in the user
		const loginRes = await fetch(`${API_ENDPOINT}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		if (!loginRes.ok) {
			const errorText = await loginRes.text();
			console.error("Auto-login error response:", errorText);
			return {
				success: false,
				data: { message: `Registration successful, but login failed: ${loginRes.status}` },
			};
		}

		const loginResult: ApiResponse<LoginReponse> = await loginRes.json();
		return loginResult;
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

export const fetchUserReportsById = async (userId: number) => {
	const response = await fetch(`${API_ENDPOINT}/users/${userId}/reports`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});

	const result: ApiResponse<UserReport[]> = await response.json();
	return result;
};

export const startVerificationAction = async (
	userId: number
): Promise<ApiResponse<{ message: string }>> => {
	const response = await fetch(`${API_ENDPOINT}/users/${userId}/verify`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	});
	const result: ApiResponse<{ message: string }> = await response.json();
	return result;
};

export const verifyAction = async (
	userId: number, code: string
): Promise<ApiResponse<{ result: boolean }>> => {
	const response = await fetch(`${API_ENDPOINT}/users/${userId}/verify/check`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
		body: JSON.stringify({ code: code }),
	});
	const result: ApiResponse<{ result: boolean }> = await response.json();
	return result;
};