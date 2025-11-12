import { useNavigate } from "react-router-dom";
import ReportForm from "../Components/ReportForm";
import "./ReportPage.css";

export default function ReportPage() {
	const navigate = useNavigate();
	return (
		<div className="report-page">
			<button onClick={() => navigate("/")} className="back-button">
				← Back to Home
			</button>
			<ReportForm />
		</div>
	);
}
