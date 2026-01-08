import { Request, Response } from "express";

export const addComment = async (req: Request, res: Response) => {
  res.status(501).json({ success: false, data: "Not implemented" });
};

export const getComments = async (req: Request, res: Response) => {
  res.status(501).json({ success: false, data: "Not implemented" });
};
