import { MessageDTO } from "../dto/MessageDTO";
import { MessageService } from "../services/MessageService";
import { Request, Response } from "express";

export const MessageController = {
	saveMessage: async (req: Request, res: Response) => {
		const message: MessageDTO = req.body;

		const savedMessage = await MessageService.saveMessage(
			message.message,
			message.reportId,
			message.senderId
		);

		res.status(201).json(savedMessage);
	},
};
