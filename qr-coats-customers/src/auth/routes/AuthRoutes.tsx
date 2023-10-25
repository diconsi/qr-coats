import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage } from "..";
import { Auth } from "../pages/Auth";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Auth />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      <Route path="/*" element={<Navigate to="/auth/dashboard" />} />
    </Routes>
  );
};

export default AuthRoutes;
