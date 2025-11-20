import type { LoginReponse } from "../interfaces/dto/login/LoginResponse";
import type { ApiResponse } from "../interfaces/dto/Response";

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

		const result: ApiResponse<LoginReponse> = await res.json();
		return result;
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Cannot reach server";
		return { success: false, data: { message: message } };
	}
};
