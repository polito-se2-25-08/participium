import type { ApiResponse } from "../interfaces/dto/Response";

const API_BASE = import.meta.env.VITE_API_ENDPOINT;

export interface ReportMessage {
	id: number;
	report_id: number;
	sender_id: number;
	message: string;
	created_at: string;
	sender?: {
		id: number;
		name: string;
		surname: string;
		username: string;
	};
}

export const messageService = {
	async sendMessage(
		reportId: number,
		message: string
	): Promise<ApiResponse<ReportMessage>> {
		try {
			const token = localStorage.getItem("token");

			const response = await fetch(
				`${API_BASE}/reports/${reportId}/messages`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(token && { Authorization: `Bearer ${token}` }),
					},
					body: JSON.stringify({ message }),
				}
			);

			const result: ApiResponse<ReportMessage> = await response.json();
			return result;
		} catch (error) {
			console.error("Error sending message:", error);
			const message =
				error instanceof Error ? error.message : "Cannot reach server";
			return { success: false, data: { message } };
		}
	},

	async getMessages(reportId: number): Promise<ApiResponse<ReportMessage[]>> {
		try {
			const token = localStorage.getItem("token");

			const response = await fetch(
				`${API_BASE}/reports/${reportId}/messages`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						...(token && { Authorization: `Bearer ${token}` }),
					},
				}
			);

			const result: ApiResponse<ReportMessage[]> = await response.json();
			return result;
		} catch (error) {
			console.error("Error fetching messages:", error);
			const message =
				error instanceof Error ? error.message : "Cannot reach server";
			return { success: false, data: { message } };
		}
	},
};
