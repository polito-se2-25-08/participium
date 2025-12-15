import { useState } from "react";
import type { Report } from "../../types";
import DangerButton from "../buttons/variants/danger/DangerButton";
import ImageZoomModal from "../modals/ImageZoomModal";
import InternalCommentSection from "../comments/InternalCommentSection";
import MessageSection from "../comments/MessageSection";
import TextInput from "../input/variants/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import type { ReportDTO } from "../../interfaces/dto/report/ReportDTO";

interface ReportReviewCardProps {
	report: ReportDTO;
	onApprove: (reportId: number) => void;
	onReject: (reportId: number) => void;
	onSuspend?: (reportId: number) => void;
	onAssignExternal?: (reportId: number) => void;
	isProcessing?: boolean;
	approveLabel?: string;
	rejectLabel?: string;
	suspendLabel?: string;
	assignLabel?: string;
	externalAssigned?: boolean;
	allowInternalComments?: boolean;
	allowMessages?: boolean;
	onSendMessage?: (reportId: number, message: string) => void;
}

export default function ReportReviewCard({
	report,
	onApprove,
	onReject,
	onSuspend,
	onAssignExternal,

	isProcessing = false,
	approveLabel = "Approve Report",
	rejectLabel = "Reject Report",
	suspendLabel = "Suspend Report",
	assignLabel = "Assign External Office",
	externalAssigned = false,
	allowInternalComments = true,
	allowMessages = false,
	onSendMessage,
}: ReportReviewCardProps) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [showComments, setShowComments] = useState(false);
	const [showMessages, setShowMessages] = useState(false);
	const [textMessage, setTextMessage] = useState("");

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const reportDate = (report as any).timestamp || (report as any).createdAt;

	// Determine number of action buttons
	const actionCount = 2 + (onSuspend ? 1 : 0) + (onAssignExternal ? 1 : 0);

	const gridCols =
		actionCount === 4
			? "grid-cols-4"
			: actionCount === 3
			? "grid-cols-3"
			: "grid-cols-2";

	const handleSendMessage = () => {
		if (textMessage.trim() === "" || !onSendMessage) return;
		onSendMessage(report.id, textMessage);
		setTextMessage("");
	};

	return (
		<>
			<div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
				<div className="flex justify-between items-start mb-4">
					<div className="flex-1">
						<h3 className="text-xl font-semibold text-gray-800 mb-2">
							{report.title}
						</h3>

						<div className="space-y-1">
							<p className="text-sm text-gray-500">
								Category:{" "}
								<span className="font-medium">
									{report.category.category}
								</span>
							</p>

							<p className="text-sm text-gray-500">
								Submitted by:{" "}
								<span className="font-medium">
									{report.user?.name
										? `${report.user.name} ${
												report.user.surname
										  } ${
												report.anonymous
													? "(Anonymous)"
													: ""
										  }`
										: ""}
								</span>
							</p>

							<p className="text-sm text-gray-500">
								Date:{" "}
								<span className="font-medium">
									{formatDate(reportDate)}
								</span>
							</p>
						</div>
					</div>

					<div className="flex flex-col items-end gap-3 min-w-[180px]">
						{/* STATUS BADGE */}
						<span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
							{report.status}
						</span>

						{/* NEW: EXTERNAL COMPANY BADGE */}
						{externalAssigned && (
							<span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
								Assigned to external company
							</span>
						)}

						{/* PHOTOS */}
						{report.photos && report.photos.length > 0 && (
							<div className="w-full">
								<div className="flex gap-2 flex-wrap justify-end">
									{report.photos.map((photo, index) => (
										<img
											key={index}
											src={photo}
											alt={`Report photo ${index + 1}`}
											className="w-24 h-24 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
											onClick={() =>
												setSelectedImage(photo)
											}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<p className="text-gray-700 mb-4">{report.description}</p>

				{/* ACTION BUTTONS */}
				<div
					className={`grid ${gridCols} gap-3 mt-6 pt-4 border-t border-gray-200`}
				>
					{/* Approve */}
					<button
						onClick={() => onApprove(report.id)}
						disabled={isProcessing}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
					>
						{approveLabel}
					</button>

					{/* Suspend */}
					{onSuspend && (
						<button
							onClick={() => onSuspend(report.id)}
							disabled={isProcessing}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
						>
							{suspendLabel}
						</button>
					)}

					{/* Assign External */}
					{onAssignExternal && (
						<button
							onClick={() => onAssignExternal(report.id)}
							disabled={isProcessing}
							className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors"
						>
							{assignLabel}
						</button>
					)}

					{/* Reject */}
					<DangerButton
						onClick={() => onReject(report.id)}
						pending={isProcessing}
					>
						{rejectLabel}
					</DangerButton>
				</div>

				{allowInternalComments && (
					<div className="mt-4 pt-2 border-t border-gray-100">
						<button
							onClick={() => setShowComments(!showComments)}
							className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
						>
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
							{showComments
								? "Hide Internal Comments"
								: "Show Internal Comments"}
						</button>

						{showComments && (
							<InternalCommentSection
								reportId={report.id}
								internalMessages={report.internalMessages}
							/>
						)}
					</div>
				)}

				{allowMessages && (
					<div className="mt-4 pt-2 border-t border-gray-100">
						<button
							onClick={() => setShowMessages(!showMessages)}
							className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
						>
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
							{showMessages ? "Hide Messages" : "Show Messages"}
						</button>

						{showMessages && (
							<div className="flex flex-col bg-gray-50 rounded-lg border border-gray-200 p-4 mt-4">
								<MessageSection
									messages={report.publicMessages}
								/>

								{onSendMessage && (
									<div className="flex flex-row gap-4 mt-2">
										<TextInput
											placeholder="Write a message here..."
											id={`update-input-${report.id}`}
											name={`update-input-${report.id}`}
											hasLabel={false}
											value={textMessage}
											onChange={(e) =>
												setTextMessage(e.target.value)
											}
										/>
										<button
											onClick={handleSendMessage}
											className="border rounded-full p-2 flex items-center justify-center hover:cursor-pointer bg-white hover:bg-gray-100"
										>
											<FontAwesomeIcon
												icon={faPaperPlane}
												className="text-blue-600"
											/>
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			<ImageZoomModal
				isOpen={selectedImage !== null}
				imageUrl={selectedImage || ""}
				onClose={() => setSelectedImage(null)}
				altText="Report photo"
			/>
		</>
	);
}
