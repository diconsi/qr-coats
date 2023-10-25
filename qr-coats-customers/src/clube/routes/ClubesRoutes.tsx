import {
  clubManagmentPath,
  profilePath,
  receiptHistoryPath,
  registerGuestPath,
  tableHistoryPath,
  userCardsPath,
  userDataPath,
} from "@/constants";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  ClubManagment,
  HomeClubes,
  PaymentHistory,
  Profile,
  RegisterGuest,
  TableShopping,
  UserCards,
  UserData,
} from "../pages";

const ClubesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeClubes />} />
      <Route path={clubManagmentPath} element={<ClubManagment />} />
      <Route path={registerGuestPath} element={<RegisterGuest />} />
      <Route path={receiptHistoryPath} element={<PaymentHistory />} />
      <Route path={profilePath} element={<Profile />} />
      <Route path={userDataPath} element={<UserData />} />
      <Route path={userCardsPath} element={<UserCards />} />
      <Route path={tableHistoryPath} element={<TableShopping />} />

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ClubesRoutes;
