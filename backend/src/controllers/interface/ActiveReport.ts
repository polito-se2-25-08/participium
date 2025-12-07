export interface ActiveReport {
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
	User: {
		name: string;
		surname: string;
		username: string;
		profile_picture: string;
	};
}
