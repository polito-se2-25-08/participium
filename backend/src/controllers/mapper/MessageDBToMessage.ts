import { MessageDTO } from "../../dto/MessageDTO";
import { MessageDB } from "../interface/MessageDB";

export const mapMessageDBToMessage = (messageDB: MessageDB): MessageDTO => {
	return {
		id: messageDB.id,
		senderId: messageDB.sender_id,
		reportId: messageDB.report_id,
		message: messageDB.message,
		createdAt: messageDB.created_at,
	};
};

export const mapMessagesDBToMessages = (
	messagesDB: MessageDB[]
): MessageDTO[] => {
	return messagesDB.map(mapMessageDBToMessage);
};
