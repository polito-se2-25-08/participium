import { ReportDTO } from "../../dto/ReportDTO";

import { ReportDB } from "../interface/ReportDB";

export const mapReportDBToReportDTO = (report: ReportDB): ReportDTO => {
	return {
		id: report.id,
		title: report.title,
		description: report.description,
		latitude: report.latitude,
		longitude: report.longitude,
		timestamp: report.timestamp,
		anonymous: report.anonymous,
		status: report.status,
		category: report.category,
		user: {
			id: report.user.id,
			name: report.user.name,
			surname: report.user.surname,
			username: report.user.username,
			profilePicture: report.user.profile_picture,
		},
		photos: report.photos.map((photo) => photo.report_photo),
		internalMessages: report.report_comment.map((message) => {
			return {
				id: message.id,
				reportId: message.report_id,
				senderId: message.sender_id,
				message: message.message,
				createdAt: message.created_at,
			};
		}),
		publicMessages: report.report_message.map((message) => {
			return {
				id: message.id,
				reportId: message.report_id,
				senderId: message.sender_id,
				message: message.message,
				createdAt: message.created_at,
			};
		}),
	};
};

export const mapReportsDBToReports = (reports: ReportDB[]): ReportDTO[] => {
	return reports.map((report) => mapReportDBToReportDTO(report));
};
