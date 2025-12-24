import { useState } from "react";
import DangerButton from "../buttons/variants/danger/DangerButton";
import PrimaryButton from "../buttons/variants/primary/PrimaryButton";
import OutlinePrimaryButton from "../buttons/variants/primary/OutlinePrimaryButton";
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
	hideRejectWhenSuspended?: boolean;
	hideAssignExternalWhenSuspended?: boolean;
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
	hideRejectWhenSuspended = false,
	hideAssignExternalWhenSuspended = false,

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
	const isSuspended = report.status === "SUSPENDED";
	const isSendDisabled = isProcessing || textMessage.trim() === "";

	const statusBadgeClass = (() => {
		switch (report.status) {
			case "RESOLVED":
				return "bg-emerald-100 text-emerald-800";
			case "REJECTED":
				return "bg-red-100 text-red-800";
			case "SUSPENDED":
				return "bg-gray-200 text-gray-800";
			case "IN_PROGRESS":
				return "bg-blue-100 text-blue-800";
			case "ASSIGNED":
				return "bg-blue-100 text-blue-800";
			case "PENDING_APPROVAL":
			default:
				return "bg-yellow-100 text-yellow-800";
		}
	})();

	const showAssignExternal =
		Boolean(onAssignExternal) &&
		!(hideAssignExternalWhenSuspended && isSuspended);
	const showReject = !(hideRejectWhenSuspended && isSuspended);

	// Determine number of action buttons
	const actionCount =
		1 +
		(showReject ? 1 : 0) +
		(onSuspend ? 1 : 0) +
		(showAssignExternal ? 1 : 0);

	const gridCols =
		actionCount === 4
			? "grid-cols-4"
			: actionCount === 3
			? "grid-cols-3"
			: "grid-cols-2";

	const handleSendMessage = () => {
		const trimmed = textMessage.trim();
		if (trimmed === "" || !onSendMessage) return;
		onSendMessage(report.id, trimmed);
		setTextMessage("");
	};

	return (
		<>
			<div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
				<div className="p-6">
					<div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
						<div className="flex-1">
							<div className="flex flex-col gap-2">
								<h3 className="text-3xl font-semibold text-gray-900 leading-snug">
									{report.title}
								</h3>
								<div className="flex flex-wrap items-center gap-2">
									<span
										className={`px-3 py-1 rounded-full text-base font-semibold ${statusBadgeClass}`}
									>
										{report.status}
									</span>
									{externalAssigned && (
										<span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-base font-semibold rounded-full">
											Assigned to external company
										</span>
									)}
								</div>
							</div>

							<div className="mt-4 grid grid-cols-1 gap-2">
								<p className="text-lg text-gray-700">
									<span className="font-semibold text-gray-900">
										Category:
									</span>{" "}
									<span className="font-medium">
										{report.category.category}
									</span>
								</p>

								<p className="text-lg text-gray-700">
									<span className="font-semibold text-gray-900">
										Submitted by:
									</span>{" "}
									<span className="font-medium">
										{report.user?.name
											? `${report.user.name} ${
												report.user.surname
										  }${report.anonymous ? " (Anonymous)" : ""}`
											: ""}
									</span>
								</p>

								<p className="text-lg text-gray-700">
									<span className="font-semibold text-gray-900">
										Date:
									</span>{" "}
									<span className="font-medium">
										{formatDate(reportDate)}
									</span>
								</p>
							</div>
						</div>

						<div className="w-full md:w-[340px]">
							{report.photos && report.photos.length > 0 ? (
								<div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
									<p className="text-base font-semibold text-gray-900 mb-3">
										Photos ({report.photos.length})
									</p>
									<div className="grid grid-cols-3 gap-2">
										{report.photos.map((photo, index) => (
											<button
												key={index}
												type="button"
												onClick={() => setSelectedImage(photo)}
												className="rounded-lg overflow-hidden border border-gray-300 bg-white hover:opacity-90 transition-opacity"
												aria-label={`Open report photo ${index + 1}`}
											>
												<img
													src={photo}
													alt={`Report photo ${index + 1}`}
													className="w-full h-24 object-cover"
												/>
											</button>
										))}
									</div>
								</div>
							) : (
								<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
									<p className="text-base font-semibold text-gray-900">
										No photos attached
									</p>
									<p className="text-base text-gray-600">
										This report was submitted without images.
									</p>
								</div>
							)}
						</div>
					</div>

					<div className="mt-6">
						<p className="text-lg text-gray-800 leading-7 whitespace-pre-line">
							{report.description}
						</p>
					</div>
				</div>

				{/* ACTION BUTTONS */}
				<div className="px-6 pb-6">
					<div
						className={`grid ${gridCols} gap-3 pt-5 border-t border-gray-200`}
					>
						<PrimaryButton
							onClick={() => onApprove(report.id)}
							pending={isProcessing}
							disabled={isProcessing}
						>
							{approveLabel}
						</PrimaryButton>

						{onSuspend && (
							<OutlinePrimaryButton
								onClick={() => onSuspend(report.id)}
								pending={isProcessing}
								disabled={isProcessing}
							>
								{suspendLabel}
							</OutlinePrimaryButton>
						)}

						{showAssignExternal && (
							<button
								onClick={() => onAssignExternal?.(report.id)}
								disabled={isProcessing}
								className={`px-4 py-2 rounded w-full border border-emerald-600 text-emerald-700 font-medium transition-colors ${
									isProcessing
										? "cursor-not-allowed opacity-50 bg-transparent"
										: "cursor-pointer hover:bg-emerald-600 hover:text-white"
								}`}
							>
								{assignLabel}
							</button>
						)}

						{showReject && (
							<DangerButton
								onClick={() => onReject(report.id)}
								pending={isProcessing}
							>
								{rejectLabel}
							</DangerButton>
						)}
					</div>
				</div>

				{allowInternalComments && (
					<div className="border-t border-gray-100 px-6 py-4">
						<button
							onClick={() => setShowComments(!showComments)}
							aria-expanded={showComments}
							className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-base font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-300 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
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
					<div className="border-t border-gray-100 px-6 py-4">
						<button
							onClick={() => setShowMessages(!showMessages)}
							aria-expanded={showMessages}
							className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-base font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-300 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
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
									<div className="flex flex-col gap-3 mt-4 md:flex-row md:items-center">
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
											disabled={isSendDisabled}
											className={`border rounded-full p-3 flex items-center justify-center bg-white transition-colors ${
												isSendDisabled
													? "cursor-not-allowed opacity-50"
													: "hover:cursor-pointer hover:bg-gray-100"
											}`}
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
