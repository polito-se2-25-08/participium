import { useNavigate } from "react-router-dom";
import { MapWindow } from "../Components/mapWindow";
import "./Dashboard.css";

export default function Dashboard() {
	const navigate = useNavigate();

	return (
		<div className="home-page">
			<header className="header">
				<h1>Participium</h1>
				<p>Citizen Participation in Urban Environment Management</p>
			</header>

			<main className="main-content">
				<section className="map-section">
					<MapWindow />
				</section>

				<section className="submit-section">
					<button
						onClick={() => navigate("/report")}
						className="submit-button"
					>
						Submit Report
					</button>
				</section>
			</main>
		</div>
	);
}
