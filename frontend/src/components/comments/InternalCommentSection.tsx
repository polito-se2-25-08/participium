import { useState, useEffect } from "react";
import { useUser } from "../providers/AuthContext";
import { commentService } from "../../api/commentService";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import type { Comment } from "../../types";

interface CommentSectionProps {
	reportId: number;
	internalMessages: Comment[];
}

export default function InternalCommentSection({
	reportId,
	internalMessages,
}: CommentSectionProps) {
	const { user } = useUser();
	const [comments, setComments] = useState<Comment[]>(internalMessages);

	const [submitting, setSubmitting] = useState(false);

	const handleAddComment = async (content: string) => {
		try {
			setSubmitting(true);

			const newMessage: Comment = {
				id: 0,
				senderId: user.id,
				reportId: reportId,
				message: content,
				createdAt: new Date().toISOString(),
				sender: {
					id: user.id,
					name: user.name,
					surname: user.surname,
					username: user.username,
					profilePicture: user.profilePicture,
					role: user.role,
				},
			};

			setComments((prev) => [...prev, newMessage]);

			const result = await commentService.sendInternalMessage(
				reportId,
				content,
				user.id
			);
			if (result.success && result.data) {
			} else {
				// Handle error (maybe show a toast)
				console.error("Failed to add comment");
			}
		} catch (err) {
			console.error("Error adding comment:", err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mt-4">
			<h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
					/>
				</svg>
				Internal Comments
			</h4>

			<CommentList comments={comments} />
			<CommentForm
				onSubmit={handleAddComment}
				isSubmitting={submitting}
			/>
		</div>
	);
}
