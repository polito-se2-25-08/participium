import type { RegisterResponse } from "../interfaces/dto/register/RegisterResponse";
import type { ApiResponse } from "../interfaces/dto/Response";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api";

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

		console.log("Register response status:", res.status, res.statusText);

		if (!res.ok) {
			const errorText = await res.text();
			console.error("Register error response:", errorText);
			return {
				success: false,
				data: { message: `Registration failed: ${res.status}` },
			};
		}

		const result: ApiResponse<RegisterResponse> = await res.json();
		console.log("Register result:", result);
		return result;
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Cannot reach server";
		return { success: false, data: { message: message } };
	}
};
