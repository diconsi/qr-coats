import { InputText } from "@/clube/components";
import { IClub } from "@/clube/interfaces";
import { ClubeLayout } from "@/clube/layout";
import { useAppDispatch, useAppSelector, useFetchAndLoad } from "@/hooks";
import { getClubes } from "@/services";
import {
  resetServicesOrder,
  setClubes,
  setServices,
} from "@/store/club/clubSlice";
import SearchIcon from "@mui/icons-material/Search";
import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ClubCard from "./components/ClubCard";

const HomeClubes = () => {
  const dispatch = useAppDispatch();
  const { callEndpoint } = useFetchAndLoad();
  const { clubes } = useAppSelector((store) => store.clubState);
  const { access_token } = useAppSelector((store) => store.authState);
  const [searchClube, setSearchClube] = useState("");
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const resp = await callEndpoint(getClubes(access_token));
    const { data } = resp;
    dispatch(setClubes(data));
    dispatch(resetServicesOrder());
    dispatch(setServices({ services: [], promotion: {} }));
  };

  return (
    <ClubeLayout>
      <Grid container height={"100%"}>
        <Grid
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          container
          height={"30%"}
        >
          <Grid item xs={12} mt={2} textAlign={"center"}>
            <Typography variant="h4">VENUES</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            mt={2}
            mb={2}
            display={"flex"}
            justifyContent={"center"}
          >
            <InputText
              type="text"
              name="find"
              placeholder="FIND CLUB"
              value={searchClube}
              onChange={(e) => setSearchClube(e.target.value)}
              endAdornmentIcon={<SearchIcon />}
              sx={{ width: { xs: "90%", md: "40%" } }}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          height="70%"
          width={"100%"}
          sx={{ overflowY: "scroll" }}
          display={"flex"}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          alignContent={"flex-start"}
        >
          {clubes
            .filter((club: IClub) =>
              club.name.toLowerCase().includes(searchClube.toLowerCase())
            )
            .map((club: IClub) => (
              <ClubCard club={club} key={club._id} />
            ))}
        </Grid>
      </Grid>
    </ClubeLayout>
  );
};

export default HomeClubes;
