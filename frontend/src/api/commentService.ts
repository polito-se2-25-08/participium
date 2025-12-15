import type { Comment } from "../types";
import type { ApiResponse } from "../interfaces/dto/Response";

const API_BASE =
	import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api/v1";

export const commentService = {
	getComments: async (reportId: number): Promise<ApiResponse<Comment[]>> => {
		try {
			const token = localStorage.getItem("token");

			const response = await fetch(
				`${API_BASE}/reports/${reportId}/comments`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						...(token && { Authorization: `Bearer ${token}` }),
					},
				}
			);

			const result: ApiResponse<Comment[]> = await response.json();
			return result;
		} catch (error) {
			console.error("Error fetching comments:", error);
			const message =
				error instanceof Error ? error.message : "Cannot reach server";
			return { success: false, data: { message } };
		}
	},

	sendInternalMessage: async (
		reportId: number,
		message: string,
		senderId: number
	): Promise<ApiResponse<Comment>> => {
		try {
			const token = localStorage.getItem("token");

			const response = await fetch(
				`${API_BASE}/reports/${reportId}/internal-messages`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(token && { Authorization: `Bearer ${token}` }),
					},
					body: JSON.stringify({ message, senderId }),
				}
			);

			const result: ApiResponse<Comment> = await response.json();
			return result;
		} catch (error) {
			console.error("Error adding comment:", error);
			const message =
				error instanceof Error ? error.message : "Cannot reach server";
			return { success: false, data: { message } };
		}
	},
};
