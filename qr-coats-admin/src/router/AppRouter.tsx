import AuthRoutes from "@/auth/routes/AuthRoutes";
import ClubesRoutes from "@/clube/routes/ClubesRoutes";
import { CheckingAuth } from "@/ui";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

const AppRouter = () => {
  const { status } = useSelector((store) => store.authState);

  if (status === "checking") {
    return <CheckingAuth />;
  }
  return (
    <Routes>
      {status === "authenticated" ? (
        <Route path="/*" element={<ClubesRoutes />} />
      ) : (
        <Route path="/auth/*" element={<AuthRoutes />} />
      )}
      <Route path="/*" element={<Navigate to="/auth/dashboard" />} />
    </Routes>
  );
};

export default AppRouter;
