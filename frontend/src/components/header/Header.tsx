import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const hideNav =
    location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/verify";

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
        to="/"
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
            to="/"
            className={navLinkClass("/")}
          >
            Dashboard
          </Link>

          {isAuthenticated ? (
            <>
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
                className={navLinkClass("/profile")}
              >
                Profile
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className={navLinkClass("/login")}
            >
              Sign In
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
