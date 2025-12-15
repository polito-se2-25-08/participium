import { CategoryDB } from "../controllers/interface/ReportDB";

export interface ApiResponse<T> {
	success: boolean;
	data: T;
}

export interface CreateReportDTO {
	title: string;
	description: string;
	category: string;
	latitude: number;
	longitude: number;
	address: string;
	anonymous: boolean;
	user_id: number;
	photos: string[];
	assignedExternalOfficeId: number | null;
}

export interface CommentDTO {
	id: number;
	reportId: number;
	userId: number;
	user: {
		name: string;
		surname: string;
		role: string;
		profile_picture?: string;
	};
	content: string;
	createdAt: string;
}

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
