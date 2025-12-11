import { UserReport, UserReportDTO } from "../interface/UserReports";
import { mapMessagesDBToMessages } from "./MessageDBToMessage";

export const mapUserReportToUserReportDTO = (
	userReport: UserReport
): UserReportDTO => {
	return {
		id: userReport.id,
		title: userReport.title,
		description: userReport.description,
		latitude: Number.parseFloat(userReport.latitude),
		longitude: Number.parseFloat(userReport.longitude),
		timestamp: userReport.timestamp,
		anonymous: userReport.anonymous,
		userId: userReport.user_id,
		status: userReport.status,
		category: userReport.category.category,
		photos: userReport.photos.map((photo) => photo.report_photo),
		messages: mapMessagesDBToMessages(userReport.messages || []),
	};
};
