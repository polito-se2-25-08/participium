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
	faX,
	faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import TextInput from "../../input/variants/TextInput";
import { postPublicMessage } from "../../../action/reportAction";

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
			console.log(reponse);
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

	return (
		<div className="flex flex-col rounded-xl shadow-xl border border-gray-600 gap-2 w-full flex-1 min-h-0">
			<SubTitle fontSize="text-[1.4rem]">Your Reports</SubTitle>
			<div className="overflow-y-auto flex-1 min-h-0 flex flex-col pr-8 pb-5 pl-8">
				{isLoading ? (
					<div className="flex flex-col h-full w-full justify-center items-center">
						<Spinner />
					</div>
				) : userReports.length === 0 ? (
					<div className="flex flex-col h-full w-full justify-center items-center opacity-60">
						<span>No reports found</span>
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{userReports.map((report) => {
							return (
								<div
									key={report.id}
									className="flex flex-col gap-2 shadow hover:shadow-md p-2 rounded-2xl"
								>
									<button
										onClick={() => handleToggleExpand(report.id)}
										className="flex flex-row items-center gap-3 hover:cursor-pointer w-full"
									>
										<div className="flex flex-row justify-between items-center w-full">
											<div className="w-1/2">
												<SubTitle textStart fontSize="text-[1.1rem]">
													{report.title}
												</SubTitle>
											</div>

											<div className="flex flex-row items-center gap-4">
												<span className="text-sm opacity-80">
													{report.status}
												</span>
											</div>
										</div>
									</button>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{selectedReport && (
				<div
					className="fixed inset-0 z-[99999] flex items-center justify-center"
					role="dialog"
					aria-modal="true"
				>
					<button
						className="absolute inset-0 bg-black/50"
						onClick={handleCloseModal}
						aria-label="Close report details"
					/>
					<div className="relative w-11/12 max-w-3xl max-h-[85vh] rounded-xl shadow-xl border border-gray-600 bg-white flex flex-col">
						<div className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
							<SubTitle fontSize="text-[1.3rem]" textStart>
								{selectedReport.title}
							</SubTitle>
							<button
								onClick={handleCloseModal}
								className="border rounded-full p-2 flex items-center justify-center hover:cursor-pointer"
								aria-label="Close"
							>
								<FontAwesomeIcon icon={faX} />
							</button>
						</div>

						<div className="p-4 overflow-y-auto min-h-0">
							{selectedReport.anonymous && (
								<>
									<span className="border-b-2 my-2 block"></span>
									<span className="text-sm opacity-80">
										This report is anonymous
									</span>
								</>
							)}

							<SubTitle fontSize="text-[1.2rem]" textStart>
								{selectedReport.category}
							</SubTitle>
							<span className="border-b-2 my-2 block"></span>

							<div className="text-sm opacity-80">
								{selectedReport.description}
							</div>

							<SubTitle fontSize="text-[1.2rem]" textStart>
								Photos
							</SubTitle>
							<span className="border-b-2 my-2 block"></span>

							<div className="flex flex-wrap gap-4">
								{selectedReport.photos.map((photo, idx) => (
									<img
										key={photo ?? idx}
										className="h-28 w-28 object-cover rounded-lg"
										src={photo}
										alt="report"
									/>
								))}
							</div>

							<span className="text-end block">
								{formatTimestamp(selectedReport.timestamp)}
							</span>

							{selectedReport.status !== "PENDING_APPROVAL" && (
								<div className="flex flex-col mt-4">
									<SubTitle fontSize="text-[1.2rem]" textStart>
										Updates
									</SubTitle>
									<span className="border-b-2 my-2 block"></span>

									<div className="flex flex-col">
										<div className="max-h-40 overflow-y-auto p-2 rounded-lg mb-2 space-y-2">
											{selectedReport.publicMessages &&
											selectedReport.publicMessages.length > 0 ? (
												selectedReport.publicMessages.map((msg) => (
													<div
														key={msg.id}
														className={`p-2 rounded-lg text-sm ${
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
												className="border rounded-full p-2 flex items-center justify-center hover:cursor-pointer"
											>
												<FontAwesomeIcon icon={faPaperPlane} />
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
