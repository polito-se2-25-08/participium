export interface ReportDTO {
	id: number;
	title: string;
	description: string;
	latitude: number;
	longitude: number;
	timestamp: string;
	anonymous: boolean;
	status:
		| "PENDING_APPROVAL"
		| "ASSIGNED"
		| "IN_PROGRESS"
		| "SUSPENDED"
		| "REJECTED"
		| "RESOLVED"
		| null;
	category: {
		id: number;
		category: string;
	};
	photos: string[];
	publicMessages: {
		id: number;
		reportId: number;
		senderId: number;
		message: string;
		createdAt: string;
		sender: {
			id: number;
			name: string;
			surname: string;
			username: string;
			profilePicture: string | null;
		};
	}[];
	internalMessages: {
		id: number;
		reportId: number;
		senderId: number;
		message: string;
		createdAt: string;
		sender: {
			id: number;
			name: string;
			surname: string;
			username: string;
			profilePicture: string | null;
		};
	}[];
	user: {
		id: number;
		name: string;
		surname: string;
		username: string;
		profilePicture: string | null;
	};
	assignedExternalOfficeId: number | null;
}
