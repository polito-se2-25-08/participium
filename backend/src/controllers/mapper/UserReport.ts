import { UserReport, UserReportDTO } from "../interface/UserReports";

export const mapUserReportToUserReportDTO = (
	userReport: UserReport
): UserReportDTO => {
	return {
		id: userReport.id,
		title: userReport.title,
		description: userReport.description,
		latitude: parseFloat(userReport.latitude),
		longitude: parseFloat(userReport.longitude),
		timestamp: userReport.timestamp,
		anonymous: userReport.anonymous,
		userId: userReport.user_id,
		status: userReport.status,
		category: userReport.category.category,
		photos: userReport.photos.map((photo) => photo.report_photo),
	};
};
