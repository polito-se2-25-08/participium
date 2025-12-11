import type { NewReportResponse } from "../interfaces/dto/report/NewReportResponse";
import type { ApiResponse } from "../interfaces/dto/Response";
import { messageService } from "../api/MessageService";

const API_ENDPOINT =
	import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api";

export const submitReport = async (
	_: unknown,
	formData: FormData
): Promise<ApiResponse<NewReportResponse>> => {
	const address = formData.get("address") as string;
	const category = formData.get("category") as string;
	const title = formData.get("title") as string;
	const description = formData.get("description") as string;
	const anonymous = formData.get("anonymous") ? true : false;
	const photos = formData.getAll("photos") as File[];

	const latitude = formData.get("latitude") as string;
	const longitude = formData.get("longitude") as string;

	const numberLatitude = Number(latitude);
	const numberLongitude = Number(longitude);

	const photosBase64 = await filesToBase64(photos);

	try {
		const token = localStorage.getItem("token");

		const res = await fetch(`${API_ENDPOINT}/reports`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
			},
			body: JSON.stringify({
				address,
				category,
				title,
				description,
				anonymous,
				photos: photosBase64,
				latitude: numberLatitude,
				longitude: numberLongitude,
			}),
		});

		const result: ApiResponse<NewReportResponse> = await res.json();

		return result;
	} catch (err: unknown) {
		console.error("Error submitting report:", err);
		const message =
			err instanceof Error ? err.message : "Cannot reach server";
		return { success: false, data: { message: message } };
	}
};

function filesToBase64(files: File[]): Promise<string[]> {
	const promises = files.map(
		(file) =>
			new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = (err) => reject(err);
			})
	);
	return Promise.all(promises);
}

export const postMessage = async (reportId: number, message: string) => {
	return await messageService.sendMessage(reportId, message);
};
