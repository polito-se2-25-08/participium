import { useUser } from "../providers/AuthContext";

interface MessageSectionProps {
	messages: {
		id: number;
		message: string;
		created_at: string;
		report_id: number;
		sender_id: number;
	}[];
}

export default function MessageSection({ messages }: MessageSectionProps) {
	const { user } = useUser();

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
						d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
					/>
				</svg>
				Messages
			</h4>

			<div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
				{(!messages || messages.length === 0) && (
					<p className="opacity-50 text-center">No messages yet</p>
				)}

				{messages && messages.map((message) => {
					const isOtherUser = message.sender_id !== user.id;

					return (
						<div
							key={message.id}
							className={`flex ${
								isOtherUser ? "justify-start" : "justify-end"
							}`}
						>
							<div
								className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
									isOtherUser
										? "bg-gray-100 text-gray-800 rounded-bl-none"
										: "bg-blue-100 text-blue-900 rounded-br-none"
								}`}
							>
								<p>{message.message}</p>
								<p className="text-xs opacity-60 mt-1 text-right">
									{new Date(message.created_at).toLocaleString()}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
