import { InputText } from "@/clube/components";
import { IClub } from "@/clube/interfaces";
import { ClubeLayout } from "@/clube/layout";
import {
  useAppDispatch,
  useAppSelector,
  useFetchAndLoad,
  useRedirectTo,
} from "@/hooks";
import { getClubes } from "@/services";
import {
  resetServicesOrder,
  setActiveClub,
  setClubes,
  setServices,
} from "@/store/club/clubSlice";
import SearchIcon from "@mui/icons-material/Search";
import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ClubCard from "./components/ClubCard";
import { clubManagmentPath } from "@/constants";

const HomeClubes = () => {
  const dispatch = useAppDispatch();
  const { callEndpoint } = useFetchAndLoad();
  const redirectTo = useRedirectTo();
  const { clubes } = useAppSelector((store) => store.clubState);
  const { access_token, idClub } = useAppSelector((store) => store.authState);
  const [searchClube, setSearchClube] = useState("");
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data } = await callEndpoint(getClubes(access_token));
    const clubesData = data as [IClub];
    dispatch(setClubes(clubesData));
    dispatch(resetServicesOrder());
    dispatch(setServices({ services: [], promotion: {} }));
    if (idClub) {
      const activeClub = clubesData.find((club) => club._id === idClub);
      if (activeClub) {
        dispatch(setActiveClub(activeClub));
        redirectTo(clubManagmentPath);
      }
    }
  };

  return (
    <ClubeLayout>
      {idClub ? (
        "..."
      ) : (
        <Grid container height={"100%"}>
          <Grid container height={"30%"}>
            <Grid
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              flexDirection={"column"}
              item
              xs={12}
              textAlign={"center"}
              sx={{ height: "100%" }}
            >
              <Typography
                sx={{ marginTop: "10%", marginBottom: "10%" }}
                variant="h2"
              >
                VENUES
              </Typography>
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
      )}
    </ClubeLayout>
  );
};

export default HomeClubes;
