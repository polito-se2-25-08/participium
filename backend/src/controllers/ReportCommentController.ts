import { Request, Response } from "express";
import * as ReportCommentService from "../services/ReportCommentService";
import { ApiResponse, CommentDTO } from "../dto/ReportDTO";
import { userRepository } from "../repositories/userRepository";

export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // report_id
    const { content } = req.body;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      const response: ApiResponse<string> = {
        success: false,
        data: "Invalid report ID",
      };
      return res.status(400).json(response);
    }

    if (!content || content.trim() === "") {
      const response: ApiResponse<string> = {
        success: false,
        data: "Content is required",
      };
      return res.status(400).json(response);
    }

    const authenticatedUser = (req as any).user;
    const userId = authenticatedUser?.id;

    if (!userId) {
      const response: ApiResponse<string> = {
        success: false,
        data: "Authentication required",
      };
      return res.status(401).json(response);
    }

    const savedComment = await ReportCommentService.createComment({
      report_id: numericId,
      sender_id: userId,
      message: content.trim(),
    });

    // Fetch user details to return full CommentDTO
    const user = await userRepository.findById(userId);

    const commentDTO: CommentDTO = {
      id: savedComment.id,
      reportId: savedComment.report_id,
      userId: savedComment.sender_id,
      user: {
        name: user?.name || "Unknown",
        surname: user?.surname || "User",
        role: user?.role || "OFFICER",
        profile_picture: user?.profile_picture || undefined,
      },
      content: savedComment.message,
      createdAt: savedComment.created_at,
    };

    const response: ApiResponse<CommentDTO> = {
      success: true,
      data: commentDTO,
    };
    return res.status(201).json(response);
  } catch (err: any) {
    console.error("Error adding comment:", err);
    const response: ApiResponse<string> = {
      success: false,
      data: err.message || "Unknown error occurred",
    };
    return res.status(500).json(response);
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // report_id
    const numericId = Number(id);

    if (isNaN(numericId)) {
      const response: ApiResponse<string> = {
        success: false,
        data: "Invalid report ID",
      };
      return res.status(400).json(response);
    }

    const comments = await ReportCommentService.getCommentsByReportId(numericId);

    const commentDTOs: CommentDTO[] = comments.map((comment) => ({
      id: comment.id,
      reportId: comment.report_id,
      userId: comment.sender_id,
      user: {
        name: comment.sender?.name || "Unknown",
        surname: comment.sender?.surname || "User",
        role: comment.sender?.role || "OFFICER",
        profile_picture: comment.sender?.profile_picture || undefined,
      },
      content: comment.message,
      createdAt: comment.created_at,
    }));

    const response: ApiResponse<CommentDTO[]> = {
      success: true,
      data: commentDTOs,
    };
    return res.status(200).json(response);
  } catch (err: any) {
    console.error("Error fetching comments:", err);
    const response: ApiResponse<string> = {
      success: false,
      data: err.message || "Unknown error occurred",
    };
    return res.status(500).json(response);
  }
};
