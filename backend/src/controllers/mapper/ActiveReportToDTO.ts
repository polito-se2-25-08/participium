import { ActiveReportDTO } from "../../dto/ActiveReport";
import { ActiveReport } from "../interface/ActiveReport";

export const mapActiveReportToDTO = (report: ActiveReport): ActiveReportDTO => {
	return {
		id: report.id,
		title: report.title,
		description: report.description,
		latitude: parseFloat(report.latitude),
		longitude: parseFloat(report.longitude),
		coordinates: [
			parseFloat(report.latitude),
			parseFloat(report.longitude),
		],
		timestamp: report.timestamp,
		anonymous: report.anonymous,
		userId: report.user_id,
		status: report.status,
		category: report.category.category,
		photos: report.photos.map((photo) => photo.report_photo),
		reporterName: report.User.name,
		reporterSurname: report.User.surname,
		reporterUsername: report.User.username,
		reporterProfilePicture: report.User.profile_picture,
	};
};

export const mapActiveReportsToDTO = (
	reports: ActiveReport[]
): ActiveReportDTO[] => reports.map(mapActiveReportToDTO);
