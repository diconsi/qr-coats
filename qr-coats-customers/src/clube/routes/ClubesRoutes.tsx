import {
  clubManagmentPath,
  profilePath,
  receiptHistoryPath,
  tableHistoryPath,
  userDataPath,
} from "@/constants";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  ClubManagment,
  HomeClubes,
  PaymentHistory,
  Profile,
  TableShopping,
  UserData,
} from "../pages";

const ClubesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeClubes />} />
      <Route path={clubManagmentPath} element={<ClubManagment />} />
      <Route path={receiptHistoryPath} element={<PaymentHistory />} />
      <Route path={profilePath} element={<Profile />} />
      <Route path={userDataPath} element={<UserData />} />
      <Route path={tableHistoryPath} element={<TableShopping />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ClubesRoutes;
