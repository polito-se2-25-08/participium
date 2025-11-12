import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
	children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
	return (
		<div
			style={{
				fontFamily: "sans-serif",
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<header
				style={{
					background: "#222",
					color: "white",
					padding: "1em",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h2>Participium</h2>
				<nav style={{ display: "flex", gap: "1em" }}>
					<Link
						to="/"
						style={{ color: "white", textDecoration: "none" }}
					>
						Home
					</Link>
					<Link
						to="/login"
						style={{ color: "white", textDecoration: "none" }}
					>
						Login
					</Link>
					<Link
						to="/register"
						style={{ color: "white", textDecoration: "none" }}
					>
						Register
					</Link>
					<Link
						to="/profile"
						style={{ color: "white", textDecoration: "none" }}
					>
						Profile
					</Link>
					<Link
						to="/report"
						style={{ color: "white", textDecoration: "none" }}
					>
						Report
					</Link>
				</nav>
			</header>

			<main
				style={{
					flex: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "flex-start", // Changed from "center" to "flex-start"
					backgroundColor: "#f7f9fb",
					padding: "2em",
				}}
			>
				{children}
			</main>
		</div>
	);
}
