import { Navigate, Route, Routes } from "react-router-dom";
import { Employes, HomeClubes, Location, Profile, Settings } from "../pages";
import {
  clubEmployessPath,
  clubLocationsPath,
  clubProfilePath,
  clubSettingsPath,
} from "@/constants";

const ClubesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeClubes />} />
      <Route path={clubProfilePath} element={<Profile />} />
      <Route path={clubEmployessPath} element={<Employes />} />
      <Route path={clubLocationsPath} element={<Location />} />
      <Route path={clubSettingsPath} element={<Settings />} />

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ClubesRoutes;
