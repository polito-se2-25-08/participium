import { ReportMessage, ReportMessageInsert } from "../models/ReportMessage";
import { supabase } from "../utils/Supabase";
import AppError from "../utils/AppError";

export const createPublicMessage = async (
	reportId: number,
	senderId: number,
	message: string
): Promise<ReportMessage> => {
	const { data, error } = await supabase
		.from("Report_Message")
		.insert({
			report_id: reportId,
			sender_id: senderId,
			message: message,
			is_public: true,
		})
		.select()
		.single();

	if (error) {
		throw new AppError(
			`Failed to create message: ${error.message}`,
			500,
			"DB_INSERT_ERROR"
		);
	}

	const newMessage = data as ReportMessage;

	return newMessage;
};

export const createInternalMessage = async (
	reportId: number,
	senderId: number,
	message: string
): Promise<ReportMessage> => {
	const { data, error } = await supabase
		.from("Report_Message")
		.insert({
			report_id: reportId,
			sender_id: senderId,
			message: message,
			is_public: false,
		})
		.select()
		.single();

	if (error) {
		throw new AppError(
			`Failed to create message: ${error.message}`,
			500,
			"DB_INSERT_ERROR"
		);
	}

	const newMessage = data as ReportMessage;

	return newMessage;
};

export const getPublicMessagesByReportId = async (
	reportId: number
): Promise<ReportMessage[]> => {
	const { data, error } = await supabase
		.from("Report_Message")
		.select(
			`
			*
			`
		)
		.eq("report_id", reportId)
		.eq("is_public", true)
		.order("created_at", { ascending: true });

	if (error) {
		throw new AppError(
			`Failed to fetch messages: ${error.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	const messages = data as ReportMessage[];

	return messages;
};

export const getInternalMessagesByReportId = async (
	reportId: number
): Promise<ReportMessage[]> => {
	const { data, error } = await supabase
		.from("Report_Message")
		.select(
			`
			*
			`
		)
		.eq("report_id", reportId)
		.eq("is_public", false)
		.order("created_at", { ascending: true });

	if (error) {
		throw new AppError(
			`Failed to fetch messages: ${error.message}`,
			500,
			"DB_FETCH_ERROR"
		);
	}

	const messages = data as ReportMessage[];

	return messages;
};
