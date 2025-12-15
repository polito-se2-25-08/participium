export type MessageDB = {
	id: number;
	sender_id: number;
	report_id: number;
	message: string;
	created_at: string;
	is_public: boolean;
	sender: {
		id: number;
		name: string;
		surname: string;
		username: string;
		profile_picture: string | null;
	};
};
