import { Link, useLocation } from "react-router-dom";

export default function Header() {
	const location = useLocation();

	const isActive = (path: string) => location.pathname === path;

	return (
		<header className="flex flex-row justify-between bg-[#222] text-white items-center p-4 shadow-2xl font-bold">
			<p className="text-3xl ">Participium</p>
			<nav className="flex flex-row gap-7 text-white no-underline text-lg">
				<Link
					to="/dashboard"
					className={isActive("/dashboard") ? "text-blue-500 " : ""}
				>
					Dashboard
				</Link>
				<Link
					to="/report"
					className={isActive("/report") ? "text-blue-500 " : ""}
				>
					Report
				</Link>
				<Link
					to="/profile"
					className={isActive("/profile") ? "text-blue-500 " : ""}
				>
					Profile
				</Link>
			</nav>
		</header>
	);
}
