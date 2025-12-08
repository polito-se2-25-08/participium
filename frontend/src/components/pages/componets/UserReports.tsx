import { useEffect, useState } from "react";
import SubTitle from "../../titles/SubTitle";
import type { UserReport } from "../../../interfaces/dto/report/UserReport";
import { fetchUserReportsById } from "../../../action/UserAction";
import { useUser } from "../../providers/AuthContext";
import { formatTimestamp } from "../../../utilis/utils";

import Spinner from "../../loaders/Spinner";
import PrimaryButton from "../../buttons/variants/primary/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowDown,
	faArrowLeft,
	faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

export default function UserReports() {
	const [userReports, setUserReports] = useState<UserReport[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [reportFetched, setReportFetched] = useState(false);
	const { user } = useUser();

	const [reportClicked, setReportClicked] = useState<Record<number, boolean>>(
		{}
	);

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
	}, []);

	useEffect(() => {
		if (!reportFetched) return;

		const initialState = Object.fromEntries(
			userReports.map((report) => [report.id, false])
		);

		setReportClicked(initialState);
	}, [userReports]);

	return (
		<div className="flex flex-col rounded-xl shadow-xl border border-gray-600 gap-3 w-1/2 h-full">
			<SubTitle fontSize="text-[1.9rem]">Your Reports</SubTitle>
			<div className="overflow-scroll max-h-[50vh] flex flex-col pr-8 pb-5 pl-8">
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
						{userReports.map((report) => (
							<div
								key={report.id}
								className="flex flex-col gap-2"
							>
								<button
									onClick={() =>
										setReportClicked((prev) => ({
											...prev,
											[report.id]: !prev[report.id],
										}))
									}
									className="flex flex-row items-center gap-3 shadow hover:shadow-md hover:cursor-pointer p-2 rounded-2xl"
								>
									<div className="flex flex-row justify-between items-center w-full">
										<div className="w-1/2">
											<SubTitle textStart>
												{report.title}
											</SubTitle>
										</div>

										<div className="flex flex-row items-center gap-4">
											<span className="">
												{report.status}
											</span>
											<FontAwesomeIcon
												icon={
													reportClicked[report.id]
														? faArrowUp
														: faArrowDown
												}
											/>
										</div>
									</div>
								</button>

								{reportClicked[report.id] && (
									<div className="flex flex-col pl-12">
										{report.anonymous && (
											<>
												<span className="border-b-2 my-2"></span>
												<span>
													This report is anonymous
												</span>
											</>
										)}

										<SubTitle>{report.category}</SubTitle>
										<span className="border-b-2 my-2"></span>

										<div>{report.description}</div>

										<SubTitle>Photos</SubTitle>
										<span className="border-b-2 my-2"></span>

										<div className="flex flex-wrap gap-4">
											{report.photos.map((photo, idx) => (
												<img
													key={photo ?? idx}
													className="h-50 w-50 object-cover"
													src={photo}
													alt="report"
												/>
											))}
										</div>

										<span className="text-end">
											{formatTimestamp(report.timestamp)}
										</span>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
