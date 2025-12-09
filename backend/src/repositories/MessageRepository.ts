import { MessageDB } from "../controllers/interface/MessageDB";
import { supabase } from "../utils/Supabase";

export const MessageRepository = {
	saveMessage: async (
		message: string,
		reportId: number,
		senderId: number
	) => {
		const { data, error } = await supabase
			.from("Report_Message")
			.insert({
				message: message,
				report_id: reportId,
				sender_id: senderId,
				timestamp: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) {
			console.error(error);
			throw new Error(error.message);
		}

		return data as MessageDB;
	},
};
