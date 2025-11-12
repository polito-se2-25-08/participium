import type MarkerI from "../my-app/src/Interfaces/Marker";
import type { DataDTO } from "./interface/DataDTO";

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
export async function newMarker(serviceId: number): Promise<MarkerI> {
	const response = await fetch(URI + "/markers", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ serviceId }),
	});
	if (response.ok) {
		const data: DataDTO<MarkerI> = await response.json();
		console.log("Ticket created: ", data.data);
		return data.data;
	} else {
		console.log(response.json());
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