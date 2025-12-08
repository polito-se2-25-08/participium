import { UserReport } from "../interface/UserReports";

export const mapUserReportToUserReportDTO = (
	userReport: UserReport
): UserReportDTO => {
	return {
		id: userReport.id,
		title: userReport.title,
		description: userReport.description,
		latitude: userReport.latitude,
		longitude: userReport.longitude,
		timestamp: userReport.timestamp,
		anonymous: userReport.anonymous,
		userId: userReport.user_id,
		status: userReport.status,
		category: userReport.category,
		photos: userReport.photos.map((photo) => photo.report_photo),
	};
};
