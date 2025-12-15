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

		internalMessages: report.report_message
			.filter((message) => !message.is_public)
			.map((message) => ({
				id: message.id,
				reportId: message.report_id,
				senderId: message.sender_id,
				message: message.message,
				createdAt: message.created_at,
				sender: {
					id: message.sender.id,
					name: message.sender.name,
					surname: message.sender.surname,
					username: message.sender.username,
					profilePicture: message.sender.profile_picture,
				},
			})),

		publicMessages: report.report_message
			.filter((message) => message.is_public)
			.map((message) => ({
				id: message.id,
				reportId: message.report_id,
				senderId: message.sender_id,
				message: message.message,
				createdAt: message.created_at,
				sender: {
					id: message.sender.id,
					name: message.sender.name,
					surname: message.sender.surname,
					username: message.sender.username,
					profilePicture: message.sender.profile_picture,
				},
			})),

		assignedExternalOfficeId: report.assignedExternalOfficeId,
	};
};

export const mapReportsDBToReports = (reports: ReportDB[]): ReportDTO[] => {
	return reports.map((report) => mapReportDBToReportDTO(report));
};
