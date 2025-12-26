export type UserReport = {
	id: number;
	title: string;
	description: string;
	latitude: number;
	longitude: number;
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
	publicMessages: {
		id: number;
		message: string;
		createdAt: string;
		senderId: number;
		reportId: number;
		isPublic: boolean;
	}[];
};

export type Message = {
	id: number;
	message: string;
	createdAt: string;
	senderId: number;
	reportId: number;
};
