import { useCheckAuth } from "@/hooks";
import  { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { CheckingAuth } from ".";

interface ProtectedRouteProps {
  redirectTo?: string;
  children?: ReactNode;
}

const ProtectedRoute = ({
  redirectTo = "/",
  children,
}: ProtectedRouteProps) => {
  const status = useCheckAuth();
  if (status === "checking") {
    return <CheckingAuth />;
  }
  
  const authenticated = status === "authenticated";
  if (!authenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
