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
};
