import { ActiveReportDTO } from "../../dto/ActiveReport";
import { ActiveReport } from "../interface/ActiveReport";

export const mapActiveReportToDTO = (
	report: ActiveReport,
	userRole: string = "CITIZEN"
): ActiveReportDTO => {
	const isAnonymous = report.anonymous;
	const canSeeAnonymous = ["OFFICER", "TECHNICIAN", "ADMIN"].includes(userRole);
	const shouldHide = isAnonymous && !canSeeAnonymous;

	return {
		id: report.id,
		title: report.title,
		description: report.description,
		latitude: Number.parseFloat(report.latitude),
		longitude: Number.parseFloat(report.longitude),
		coordinates: [
			Number.parseFloat(report.latitude),
			Number.parseFloat(report.longitude),
		],
		timestamp: report.timestamp,
		anonymous: report.anonymous,
		userId: report.user_id,
		status: report.status,
		category: report.category.category,
		photos: report.photos.map((photo) => photo.report_photo),
		reporterName: shouldHide ? "Anonymous" : report.User.name,
		reporterSurname: shouldHide ? "" : report.User.surname,
		reporterUsername: shouldHide ? "anonymous" : report.User.username,
		reporterProfilePicture: shouldHide ? "" : report.User.profile_picture,
	};
};

export const mapActiveReportsToDTO = (
	reports: ActiveReport[],
	userRole: string = "CITIZEN"
): ActiveReportDTO[] =>
	reports.map((report) => mapActiveReportToDTO(report, userRole));
