import { useAppDispatch, useAppSelector } from "@/hooks";
import { setServices } from "@/store/club/clubSlice";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import GuestForm from "./components/GuestForm";
import ServicesSection from "./components/ServicesSection";
import TotalsSection, { IService } from "./components/TotalsSection";
import UserSection from "./components/UserSection";

export interface ISummary {
  id: number;
  name: string;
  tax: number;
  icon: string;
  status: boolean;
  total: number;
}

const Services = () => {
  const { activeClub, services } = useAppSelector((store) => store.clubState);
  const { isAnonymous } = useAppSelector((store) => store.authState);
  const { services: activeServices, withInformationGuest } = activeClub;
  const dispatch = useAppDispatch();
  useEffect(() => {
    initializeServices();
  }, [activeClub, services.length]);

  const initializeServices = () => {
    const promotion = activeServices.find((item) => item.id == "0003");

    const servicesClub = activeServices
      .map((item) => ({
        ...item,
        total: 0,
      }))
      .filter((item) => item.id !== "0003");
    dispatch(setServices({ services: servicesClub, promotion: promotion }));
  };
  const isVisibleTable = services.some(
    (service: IService) => service.total !== 0
  );

  return (
    <Grid
      alignItems={isVisibleTable ? "center" : "initial"}
      container
      mt={"10%"}
    >
      <Grid container>
        <ServicesSection />
        <TotalsSection />
        <Grid container>
          <Grid container>
            {isAnonymous && withInformationGuest && <GuestForm />}
            <UserSection />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Services;
