import type { RegisterResponse } from "../interfaces/dto/register/RegisterResponse";
import type { ApiResponse } from "../interfaces/dto/Response";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

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

		const result: ApiResponse<RegisterResponse> = await res.json();
		return result;
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Cannot reach server";
		return { success: false, data: { message: message } };
	}
};
