import { messageRepository } from "../repositories/MessageRepository";

export const MessageService = {
	saveMessage: async (
		message: string,
		reportId: number,
		senderId: number
	) => {
		const reponse = await messageRepository.saveMessage(
			message,
			reportId,
			senderId
		);
		return reponse;
	},
};
