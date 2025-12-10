export interface ActiveReportDTO {
	id: number;
	title: string;
	description: string;
	latitude: number;
	longitude: number;
	coordinates: [number, number];
	timestamp: string;
	anonymous: boolean;
	userId: number;
	status:
		| "PENDING_APPROVAL"
		| "ASSIGNED"
		| "IN_PROGRESS"
		| "SUSPENDED"
		| "REJECTED"
		| "RESOLVED"
		| null;
	category: string;
	photos: string[];
	reporterName: string;
	reporterSurname: string;
	reporterUsername: string;
	reporterProfilePicture: string;
}
