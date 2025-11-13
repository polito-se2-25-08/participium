import type { setupUserI } from "../interface/setupUser";

const URI = import.meta.env.VITE_API_URL;

export async function CheckServer() {
	const response = await fetch(URI + "/health");
	if (response.ok) {
		console.log("Server is healthy");
		const data = await response.json();
		return data.status === "ok";
	} else {
		throw new Error("Server is not reachable");
	}
}

export async function setupUser(setupUser: setupUserI): Promise<string>
{
	const response = await fetch(URI + "/api/v1/admin/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(setupUser),
	});

	if (response.ok) {
		const result = await response.json();
		return result.data.password;
	} else {
		console.log(await response.json());
		throw new Error("Server is not reachable");
	}
}
