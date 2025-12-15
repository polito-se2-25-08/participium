import { MessageDTO } from "../../dto/MessageDTO";
import { MessageDB } from "./MessageDB";

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
	messages: MessageDB[];
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
	publicMessages: MessageDTO[];
};
