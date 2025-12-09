import { supabase } from "../utils/Supabase";

export const messageRepository = {
	saveMessage: async (
		message: string,
		reportId: number,
		senderId: number
	) => {
		const { error } = await supabase.from("Report_Message").insert({
			message: message,
			report_id: reportId,
			sender_id: senderId,
			timestamp: new Date().toISOString(),
		});

		console.error(error);

		if (error) {
			return false;
		}

		return true;
	},
};
