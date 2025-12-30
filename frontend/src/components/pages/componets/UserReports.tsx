import { useEffect, useState } from "react";
import SubTitle from "../../titles/SubTitle";
import type {
	UserReport,
} from "../../../interfaces/dto/report/UserReport";
import { fetchUserReportsById } from "../../../action/UserAction";

import { useUser } from "../../providers/AuthContext";
import { formatTimestamp } from "../../../utilis/utils";

import Spinner from "../../loaders/Spinner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCircleCheck,
	faCirclePause,
	faCircleXmark,
	faClock,
	faPersonDigging,
	faPaperPlane,
	faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import TextInput from "../../input/variants/TextInput";
import { postPublicMessage } from "../../../action/reportAction";
import ReportPopupModal from "../../modals/ReportPopupModal";

type ReportState = {
	newMessage: string;
};

export default function UserReports() {
	const [userReports, setUserReports] = useState<UserReport[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [reportFetched, setReportFetched] = useState(false);
	const { user } = useUser();
	const [selectedReportId, setSelectedReportId] = useState<number | null>(
		null
	);

	const [reportStates, setReportStates] = useState<
		Record<number, ReportState>
	>({});
	const handleMessageChange = (reportId: number, newText: string) => {
		setReportStates((prev) => ({
			...prev,
			[reportId]: {
				...prev[reportId],
				newMessage: newText,
			},
		}));
	};

	const handleSendMessage = async (reportId: number) => {
		const messageText = reportStates[reportId].newMessage;

		if (!messageText) return;

		const newMessage = {
			id: 0,
			senderId: user.id,
			reportId: reportId,
			message: messageText,
			isPublic: true,
			createdAt: new Date().toISOString(),
		};

		setUserReports((prev) => {
			const updatedReports = prev.map((report) => {
				if (report.id === reportId) {
					return {
						...report,
						publicMessages: [...report.publicMessages, newMessage],
					};
				}
				return report;
			});
			return updatedReports;
		});

		setReportStates((prev) => ({
			...prev,
			[reportId]: {
				...prev[reportId],
				newMessage: "",
			},
		}));

		const returnedMessage = await postPublicMessage(
			reportId,
			messageText,
			user.id
		);

		if (!returnedMessage.success) return;
	};

	const handleToggleExpand = (reportId: number) => {
		setSelectedReportId(reportId);
	};

	const handleCloseModal = () => {
		setSelectedReportId(null);
	};

	useEffect(() => {
		const init = async () => {
			setReportFetched(false);
			setIsLoading(true);
			const reponse = await fetchUserReportsById(user.id);
			if (reponse.success) {
				setUserReports(reponse.data);
			}

			setIsLoading(false);
			setReportFetched(true);
		};
		init();
	}, [user.id]);

	useEffect(() => {
		if (!reportFetched) return;

		setReportStates((prev) => {
			const updated = { ...prev };

			for (const report of userReports) {
				if (!updated[report.id]) {
					updated[report.id] = {
						newMessage: "",
					};
				}
			}

			return updated;
		});
	}, [userReports, reportFetched]);

	const selectedReport =
		selectedReportId != null
			? userReports.find((r) => r.id === selectedReportId) ?? null
			: null;

	const selectedReportState =
		selectedReportId != null && reportStates[selectedReportId]
			? reportStates[selectedReportId]
			: { newMessage: "" };

	const getStatusBadge = (status: UserReport["status"]) => {
		switch (status) {
			case "PENDING_APPROVAL":
				return {
					label: "Pending approval",
					icon: faClock,
					className:
						"bg-yellow-100 text-yellow-800 border-yellow-200",
				};
			case "ASSIGNED":
				return {
					label: "Assigned",
					icon: faUserCheck,
					className: "bg-blue-100 text-blue-800 border-blue-200",
				};
			case "IN_PROGRESS":
				return {
					label: "In progress",
					icon: faPersonDigging,
					className:
						"bg-indigo-100 text-indigo-800 border-indigo-200",
				};
			case "SUSPENDED":
				return {
					label: "Suspended",
					icon: faCirclePause,
					className: "bg-gray-100 text-gray-800 border-gray-200",
				};
			case "REJECTED":
				return {
					label: "Rejected",
					icon: faCircleXmark,
					className: "bg-red-100 text-red-800 border-red-200",
				};
			case "RESOLVED":
				return {
					label: "Resolved",
					icon: faCircleCheck,
					className:
						"bg-green-100 text-green-800 border-green-200",
				};
			default:
				return {
					label: "Unknown",
					icon: faClock,
					className: "bg-gray-100 text-gray-800 border-gray-200",
				};
		}
	};

	return (
		<div className="flex flex-col rounded-xl shadow-xl border border-gray-600 w-full flex-1 min-h-0 overflow-hidden">
			<div className="flex flex-col gap-1 px-6 py-4 border-b border-gray-200 bg-gray-50">
				<div className="flex flex-row items-center justify-between gap-3">
					<SubTitle fontSize="text-[1.6rem]" textStart>
						Your Reports
					</SubTitle>
					<span className="text-base opacity-70">
						{userReports.length}
					</span>
				</div>
				<span className="text-base opacity-70">
					Click a report to view details
				</span>
			</div>

			<div className="overflow-y-auto flex-1 min-h-0 flex flex-col px-6 py-5">
				{isLoading ? (
					<div className="flex flex-col h-full w-full justify-center items-center">
						<Spinner />
					</div>
				) : userReports.length === 0 ? (
					<div className="flex flex-col h-full w-full justify-center items-center opacity-60">
						<span>No reports found</span>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{userReports.map((report) => {
							const statusBadge = getStatusBadge(report.status);
							const reportDate = formatTimestamp(report.timestamp);
							return (
								<div
									key={report.id}
									className="flex flex-col border border-gray-200 bg-white shadow hover:shadow-md rounded-2xl"
								>
									<button
										onClick={() => handleToggleExpand(report.id)}
										className="flex flex-row items-center gap-4 hover:cursor-pointer w-full px-5 py-4"
									>
										<div className="flex flex-row justify-between items-start w-full gap-3">
											<div className="flex flex-col min-w-0 flex-1">
												<SubTitle
													textStart
													fontSize="text-[1.25rem]"
													className="!truncate"
												>
													{report.title}
												</SubTitle>
												<span className="text-sm opacity-60 text-start flex flex-row items-center gap-2">
													<FontAwesomeIcon icon={faClock} />
													{reportDate}
												</span>
											</div>

											<span
												className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full border ${statusBadge.className}`}
											>
												<FontAwesomeIcon icon={statusBadge.icon} />
												{statusBadge.label}
											</span>
										</div>
									</button>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{selectedReport &&
				(() => {
					const statusBadge = getStatusBadge(selectedReport.status);
					return (
						<ReportPopupModal
							isOpen={true}
							onClose={handleCloseModal}
							header={
								<>
									<SubTitle
										fontSize="text-[1.5rem]"
										textStart
										className="!truncate"
									>
										{selectedReport.title}
									</SubTitle>
									<div className="flex flex-row flex-wrap items-center gap-2">
										<span
											className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full border ${statusBadge.className}`}
										>
											<FontAwesomeIcon icon={statusBadge.icon} />
											{statusBadge.label}
										</span>
										<span className="text-sm opacity-60">
											{formatTimestamp(selectedReport.timestamp)}
										</span>
									</div>
								</>
							}
						>
							{selectedReport.anonymous && (
								<>
									<span className="border-b-2 my-2 block"></span>
									<span className="text-base opacity-80">
										This report is anonymous
									</span>
								</>
							)}

							<SubTitle fontSize="text-[1.3rem]" textStart>
								{selectedReport.category}
							</SubTitle>
							<span className="border-b-2 my-2 block"></span>

							<div className="text-base opacity-80">
								{selectedReport.description}
							</div>

							<SubTitle fontSize="text-[1.3rem]" textStart>
								Photos
							</SubTitle>
							<span className="border-b-2 my-2 block"></span>

							<div className="flex flex-wrap gap-4">
								{selectedReport.photos.map((photo, idx) => (
									<img
										key={photo ?? idx}
										className="h-32 w-32 object-cover rounded-lg"
										src={photo}
										alt="report"
									/>
								))}
							</div>

							{selectedReport.status !== "PENDING_APPROVAL" && (
								<div className="flex flex-col mt-4">
									<SubTitle fontSize="text-[1.3rem]" textStart>
										Updates
									</SubTitle>
									<span className="border-b-2 my-2 block"></span>

									<div className="flex flex-col">
										<div className="max-h-56 overflow-y-auto p-3 rounded-lg mb-3 space-y-2">
											{selectedReport.publicMessages &&
											selectedReport.publicMessages.length > 0 ? (
												selectedReport.publicMessages.map((msg) => (
													<div
														key={msg.id}
														className={`p-3 rounded-lg text-base ${
															msg.senderId === user.id
																? "bg-blue-100 ml-auto text-right"
																: "bg-gray-100 mr-auto text-left"
														} max-w-[80%]`}
													>
														<p>{msg.message}</p>
														<span className="text-xs opacity-50">
															{new Date(msg.createdAt).toLocaleString()}
														</span>
													</div>
												))
											) : (
												<p className="opacity-50 text-center">
													No updates yet
												</p>
											)}
										</div>

										<div className="flex flex-row gap-4">
											<TextInput
												placeholder="Write a message here..."
												id={`update-input-${selectedReport.id}`}
												name={`update-input-${selectedReport.id}`}
												hasLabel={false}
												value={selectedReportState.newMessage}
												onChange={(e) =>
													handleMessageChange(
														selectedReport.id,
														e.target.value
													)
												}
											/>
											<button
												onClick={() =>
													handleSendMessage(selectedReport.id)
												}
												className="border rounded-full p-3 flex items-center justify-center hover:cursor-pointer"
											>
												<FontAwesomeIcon icon={faPaperPlane} />
											</button>
										</div>
									</div>
								</div>
							)}
						</ReportPopupModal>
					);
				})()} 
		</div>
	);
}
