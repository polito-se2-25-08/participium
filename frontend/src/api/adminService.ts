const URI = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

export async function setupUser(
	setupUser: any,
	token: string
): Promise<string> {
	const response = await fetch(URI + "/api/v1/admin/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
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

export async function getAllUsers(token: string) {
	const response = await fetch(URI + "/api/v1/admin/users", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.ok) {
		const result = await response.json();
		return result.data;
	} else {
		try {
			const error = await response.json();
			throw new Error(error.message || "Failed to fetch users");
		} catch (e) {
			throw new Error(
				`Server error: ${response.status} ${response.statusText}`
			);
		}
	}
}

export async function assignRole(userId: number, role: string, token: string) {
	const response = await fetch(URI + `/api/v1/admin/users/${userId}/role`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ role }),
	});

	if (response.ok) {
		const result = await response.json();
		return result.data;
	} else {
		try {
			const error = await response.json();
			throw new Error(error.message || "Failed to assign role");
		} catch (e) {
			throw new Error(
				`Server error: ${response.status} ${response.statusText}`
			);
		}
	}
}
