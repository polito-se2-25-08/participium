import { useEffect, useState } from "react";
import SubTitle from "../../titles/SubTitle";
import type { UserReport } from "../../../interfaces/dto/report/UserReport";
import { fetchUserReportsById } from "../../../action/UserAction";
import { useUser } from "../../providers/AuthContext";
import { formatTimestamp } from "../../../utilis/utils";

import Spinner from "../../loaders/Spinner";

export default function UserReports() {
	const [userReports, setUserReports] = useState<UserReport[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useUser();

	useEffect(() => {
		const init = async () => {
			setIsLoading(true);
			const reponse = await fetchUserReportsById(user.id);
			if (reponse.success) {
				setUserReports(reponse.data);
				setIsLoading(false);
			}
		};
		init();
	}, []);

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
					userReports.map((report) => (
						<div
							key={report.id ?? report.timestamp}
							className="flex flex-col gap-3"
						>
							<div className="flex flex-col">
								<SubTitle>{report.title}</SubTitle>

								{report.anonymous && (
									<>
										<span className="border-b-2 mb-2 mt-2"></span>
										<span>This report is anonymous</span>
									</>
								)}

								<span className="border-b-2 mb-2 mt-2"></span>

								<SubTitle>{report.category}</SubTitle>

								<div>{report.description}</div>

								<SubTitle>Photos</SubTitle>
								<span className="border-b-2 mb-2 mt-2"></span>

								<div className="flex flex-wrap gap-4">
									{report.photos.map((photo, idx) => (
										<img
											key={photo ?? idx}
											className="h-50 w-50"
											src={photo}
											alt="report"
										/>
									))}
								</div>
							</div>

							<span className="text-end">
								{formatTimestamp(report.timestamp)}
							</span>
						</div>
					))
				)}
			</div>
		</div>
	);
}
