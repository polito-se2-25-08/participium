import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const hideNav =
    location.pathname === "/" || location.pathname === "/register" || location.pathname === "/verify";

  return (
    <header className="flex flex-row justify-between bg-[#222] text-white items-center p-4 shadow-2xl font-bold">
      <p className="text-3xl ">Participium</p>

      {!hideNav && (
        <nav className="flex flex-row gap-7 text-white no-underline text-lg">
          <Link
            to="/dashboard"
            className={isActive("/dashboard") ? "text-blue-500" : ""}
          >
            Dashboard
          </Link>

          {user?.role !== "ADMIN" &&
            user?.role !== "OFFICER" &&
            user?.role !== "TECHNICIAN" &&
            user?.role !== "EXTERNAL MAINTAINER" && (
              <Link
                to="/report"
                className={isActive("/report") ? "text-blue-500" : ""}
              >
                Report
              </Link>
            )}

          {user?.role === "OFFICER" && (
            <Link
              to="/pending-reports"
              className={isActive("/pending-reports") ? "text-blue-500" : ""}
            >
              Review Queue
            </Link>
          )}
          {(user?.role === "TECHNICIAN" || user?.role === "EXTERNAL MAINTAINER") && (
            <Link
              to="/category-reports"
              className={isActive("/category-reports") ? "text-blue-500" : ""}
            >
              Report Queue
            </Link>
          )}
          <Link
            to="/profile"
            className={isActive("/profile") ? "text-blue-500" : ""}
          >
            Profile
          </Link>
        </nav>
      )}
    </header>
  );
}
