import { MessageRepository } from "../repositories/MessageRepository";

export const MessageService = {
	saveMessage: async (
		message: string,
		reportId: number,
		senderId: number
	) => {
		const reponse = await MessageRepository.saveMessage(
			message,
			reportId,
			senderId
		);
		return reponse;
	},
};
