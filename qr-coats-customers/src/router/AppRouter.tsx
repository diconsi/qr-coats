import AuthRoutes from "@/auth/routes/AuthRoutes";
import ClubesRoutes from "@/clube/routes/ClubesRoutes";
import { useAppSelector } from "@/hooks";
import { CheckingAuth } from "@/ui";
import { Navigate, Route, Routes } from "react-router-dom";

const AppRouter = () => {
  const { status } = useAppSelector((store) => store.authState);

  if (status === "checking") {
    return <CheckingAuth />;
  }
  return (
    <Routes>
      {status === "authenticated" ? (
        <Route path="/*" element={<ClubesRoutes />} />
      ) : (
        <Route path="/*" element={<AuthRoutes />} />
      )}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
