import type {
	ClientReportMapI,
	ReportMapI,
} from "../interfaces/dto/report/NewReportResponse";

export const mapFetchedActiveReortToActiveReport = (
	report: ReportMapI
): ClientReportMapI => {
	return {
		id: report.id,
		title: report.title,
		description: report.description,
		latitude: report.latitude,
		longitude: report.longitude,
		coordinates: report.coordinates,
		status: report.status,
		timestamp: report.timestamp,
		userId: report.userId,
		anonymous: report.anonymous,
		category: report.category,
		photos: report.photos,
		reporterName: report.reporterName,
		reporterSurname: report.reporterSurname,
		reporterUsername: report.reporterUsername,
		reporterProfilePicture: report.reporterProfilePicture,
	};
};

export const mapFetchedActiveReportsToActiveReports = (
	reports: ReportMapI[]
) => {
	if (!reports) return [];
	return reports.map((report) => mapFetchedActiveReortToActiveReport(report));
};
