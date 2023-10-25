import accesIcon from "@/assets/acces.svg";
import iconCoat from "@/assets/coat.svg";
import { Grid } from "@mui/material";
import { useState } from "react";
import ServicesSection from "./components/ServicesSection";
import TotalsSection from "./components/TotalsSection";
import UserSection from "./components/UserSection";
import { useSelector } from "react-redux";

export interface ISummary {
  id: number;
  name: string;
  tax: number;
  icon: string;
  total: number;
}

const Services = () => {
  const {
    activeClub: { services },
  } = useSelector((store) => store.clubState);
  const newData = services
    .map((item) => {
      let icon = "";

      if (item.name === "Coat") {
        icon = iconCoat;
      } else if (item.name === "Entry") {
        icon = accesIcon;
      }
      return { ...item, icon, total: 0 };
    })
    .filter((item) => item.id !== "0003");

  const promotion = services.find((item) => item.id == "0003");

  const [summary, setSummary] = useState<ISummary[]>([...newData]);

  return (
    <Grid
      alignItems="center"
      container
      sx={{ height: "70%", overflowY: "scroll", pt: 4 }}
    >
      <Grid container sx={{ height: "100%" }}>
        <ServicesSection
          summary={summary}
          setSummary={setSummary}
          promotion={promotion}
        />
        <TotalsSection summary={summary} promotion={promotion} />
        <Grid container sx={{ height: "25%" }}>
          <UserSection summary={summary} />
        </Grid> 
      </Grid>
    </Grid>
  );
};

export default Services;
