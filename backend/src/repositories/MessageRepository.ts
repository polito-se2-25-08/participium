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
				created_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) {
			console.error(error);
			throw new Error(error.message);
		}

		return data as MessageDB;
	},

	getMessagesByReportId: async (reportId: number) => {
		const { data, error } = await supabase
			.from("Report_Message")
			.select("*")
			.eq("report_id", reportId)
			.order("created_at", { ascending: true });

		if (error) {
			console.error(error);
			throw new Error(error.message);
		}

		return data as MessageDB[];
	},
};
