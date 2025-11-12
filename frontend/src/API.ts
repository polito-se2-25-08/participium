import type { MarkerI } from "./interface/Marker";
import type { DataDTO } from "./interface/DataDTO";
import type { setupUserI } from "./interface/setupUser";

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

export async function getMarkers(): Promise<MarkerI[]> {
	const response = await fetch(URI + "/markers", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data: DataDTO<MarkerI[]> = await response.json();
		console.log("Markers retrieved: ", data.data);
		return data.data;
	} else {
		console.log(response.json());
		throw new Error("Server is not reachable");
	}
}

export async function setupUser(setupUser: setupUserI): Promise<string>
{
	const response = await fetch(URI + "/api/admin/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(setupUser),
	});

	if (response.ok) {
		const result = await response.json();
		console.log("User setup successful: ", result.data.password);
		return result.data.password;
	} else {
		console.log(response.json());
		throw new Error("Server is not reachable");
	}
}
