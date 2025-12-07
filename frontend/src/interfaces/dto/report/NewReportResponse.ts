export interface NewReportResponse {
	id: number;
	title: string;
	description: string;
	category: string;
	address: string;
	anonymous: boolean;
	latitude: number;
	longitude: number;
	photos: string[];
}

export interface ReportMapI {
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

export interface ClientReportMapI {
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
