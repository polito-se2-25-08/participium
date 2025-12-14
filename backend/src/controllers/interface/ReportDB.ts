import { MessageDB } from "./MessageDB";

export interface ReportDB {
	id: number;
	title: string;
	description: string;
	latitude: number;
	longitude: number;
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
	assignedExternalOfficeId: number | null;
	report_message: MessageDB[];
	report_comment: MessageDB[];
	photos: PhotosDB[];
	user: UserDB;
	category: CategoryDB;
}

export interface CategoryDB {
	id: number;
	category: string;
}

interface PhotosDB {
	id: number;
	report_id: number;
	report_photo: string;
}

interface UserDB {
	id: 58;
	name: string;
	role:
		| "ADMIN"
		| "TECHNICIAN"
		| "CITIZEN"
		| "EXTERNAL_MAINTAINER"
		| "OFFICER";
	salt: string;
	email: string;
	surname: string;
	password: string;
	username: string;
	isVerified: boolean;
	profile_picture: string | null;
	telegram_username: string | null;
	email_notification: boolean;
}
