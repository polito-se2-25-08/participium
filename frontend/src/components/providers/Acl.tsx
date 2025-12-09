import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Role = "ADMIN" | "CITIZEN" | "OFFICER" | "TECHNICIAN" | "EXTERNAL MAINTAINER";

interface Props {
  allowedRoles: Role[];
}

export default function Acl({ allowedRoles }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
