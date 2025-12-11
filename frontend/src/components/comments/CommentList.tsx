import type { Comment } from "../../types";

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
	if (comments.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500 italic">
				No comments yet. Start the discussion!
			</div>
		);
	}

	return (
		<div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
			{comments.map((comment) => (
				<div key={comment.id} className="flex gap-3 items-start">
					<div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
						{comment.user.name[0]}
						{comment.user.surname[0]}
					</div>
					<div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
						<div className="flex justify-between items-baseline mb-1">
							<span className="font-semibold text-sm text-gray-900">
								{comment.user.name} {comment.user.surname}
							</span>
							<span className="text-xs text-gray-500">
								{new Date(comment.createdAt).toLocaleString()}
							</span>
						</div>
						<div className="text-xs text-blue-600 font-medium mb-2 uppercase tracking-wide">
							{comment.user.role}
						</div>
						<p className="text-sm text-gray-700 whitespace-pre-wrap">
							{comment.content}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
