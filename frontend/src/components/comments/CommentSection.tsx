import { useUser } from "../providers/AuthContext";

interface CommentSectionProps {
	messages: {
		id: number;
		message: string;
		created_at: string;
		report_id: number;
		sender_id: number;
	}[];
}
export default function CommentSection({ messages }: CommentSectionProps) {
	const user = useUser();
	return (
		<div className="">
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

			<div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
				{messages.length === 0 && (
					<p className="opacity-50 text-center">No updates yet</p>
				)}

				{messages.map((message) => {
					const isOtherUser = message.sender_id !== user.user.id;

					return (
						<div
							key={message.id}
							className={`flex ${
								isOtherUser ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
									isOtherUser
										? "bg-gray-200 text-black"
										: "bg-blue-500 text-white"
								}`}
							>
								<span>{message.message}</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
