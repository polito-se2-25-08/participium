export interface ReportMessage {
	id: number;
	report_id: number;
	sender_id: number;
	message: string;
	created_at: string;
	is_public: boolean;
}

export interface ReportMessageDTO {
	id: number;
	reportId: number;
	senderId: number;
	message: string;
	createdAt: string;
	isPublic: boolean;
}

export interface ReportMessageInsert {
	report_id: number;
	sender_id: number;
	message: string;
}
