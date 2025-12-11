import { UserReport, UserReportDTO } from "../interface/UserReports";

export const mapReportToReportDTO = (report: UserReport): UserReportDTO => {
	return {
		id: report.id,
		title: report.title,
		description: report.description,
		latitude: parseFloat(report.latitude),
		longitude: parseFloat(report.longitude),
		timestamp: report.timestamp,
		anonymous: report.anonymous,
		userId: report.user_id,
		status: report.status,
		category: report.category.category,
		photos: report.photos.map((photo) => photo.report_photo),
	};
};

export const mapReportsToReportsDTO = (
	reports: UserReport[]
): UserReportDTO[] => {
	if (!reports) return [];
	return reports.map((report) => mapReportToReportDTO(report));
};
