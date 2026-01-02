import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const hideNav =
    location.pathname === "/" || location.pathname === "/register" || location.pathname === "/verify";

  const navLinkClass = (path: string) => {
    const active = isActive(path);

    return [
      "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
      "transition-colors",
      active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white",
    ].join(" ");
  };

  return (
    <header className="flex flex-row items-center justify-between bg-blue-500 text-white px-4 py-3 shadow-sm border-b border-white/10">
      <Link
        to="/dashboard"
        aria-label="Go to dashboard"
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
      >
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white hover:text-white">
          Participium
        </span>
      </Link>

      {!hideNav && (
        <nav className="flex flex-row items-center gap-1 sm:gap-2 text-white no-underline">
          <Link
            to="/dashboard"
            className={navLinkClass("/dashboard")}
          >
            Dashboard
          </Link>

          {user?.role !== "ADMIN" &&
            user?.role !== "OFFICER" &&
            user?.role !== "TECHNICIAN" &&
            user?.role !== "EXTERNAL_MAINTAINER" && (
              <Link
                to="/report"
                className={navLinkClass("/report")}
              >
                Report
              </Link>
            )}

          {user?.role === "OFFICER" && (
            <Link
              to="/pending-reports"
              className={navLinkClass("/pending-reports")}
            >
              Review Queue
            </Link>
          )}
          {(user?.role === "TECHNICIAN" ||
            user?.role === "EXTERNAL_MAINTAINER") && (
            <Link
              to="/category-reports"
              className={navLinkClass("/category-reports")}
            >
              Report Queue
            </Link>
          )}
          <Link
            to="/profile"
            className={`${navLinkClass("/profile")} relative`}
          >
            {user?.profilePicture && (
            <img
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2.5em] h-[2.5em] rounded-full hover:scale-105 hover:shadow-lg brightness-100 hover:brightness-80 transition-all transition-filter duration-300 cursor-pointer"
              src={
                `data:image/png;base64,` +
                user?.profilePicture
              }
              alt="user profile picture"
            />
            )}
            {!user?.profilePicture && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Profile</span>
            )}
              <span className="invisible">Profile</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
