import type { LoginReponse } from "../interfaces/dto/login/LoginResponse";
import type { ApiResponse } from "../interfaces/dto/Response";

const API_ENDPOINT =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api";
export const loginAction = async (
  _: unknown,
  formData: FormData
): Promise<ApiResponse<LoginReponse>> => {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetch(`${API_ENDPOINT}/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    console.log("Login response status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Login error response:", errorText);
      return {
        success: false,
        data: { message: `Login failed: ${res.status}` },
      };
    }

    const result: ApiResponse<LoginReponse> = await res.json();
    console.log("Login result:", result);
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Cannot reach server";
    return { success: false, data: { message: message } };
  }
};
