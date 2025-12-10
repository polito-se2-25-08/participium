export type UserReport = {
	id: number;
	title: string;
	description: string;
	latitude: string;
	longitude: string;
	timestamp: string;
	anonymous: boolean;
	user_id: number;
	category_id: number;
	status:
		| "PENDING_APPROVAL"
		| "ASSIGNED"
		| "IN_PROGRESS"
		| "SUSPENDED"
		| "REJECTED"
		| "RESOLVED"
		| null;
	category: { category: string };
	photos: { report_photo: string }[];
	messages: {
		id: number;
		message: string;
		created_at: string;
		sender_id: number;
		report_id: number;
	}[];
};

export type UserReportDTO = {
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
	messages: {
		id: number;
		message: string;
		createdAt: string;
		senderId: number;
		reportId: number;
	}[];
};
