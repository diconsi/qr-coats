import { InputText } from "@/clube/components";
import { IClub } from "@/clube/interfaces";
import { ClubeLayout } from "@/clube/layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import { getClubesByAdmin } from "@/services";
import { setClubes } from "@/store/club/clubSlice";
import SearchIcon from "@mui/icons-material/Search";
import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ClubCard from "./components/ClubCard";

const HomeClubes = () => {
  const dispatch = useAppDispatch();
  const { callEndpoint } = useFetchAndLoad();
  const { uid, access_token } = useAppSelector((store) => store.authState);
  const { clubes } = useAppSelector((store) => store.clubState);
  const [searchClube, setSearchClube] = useState("");
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const resp = await callEndpoint(getClubesByAdmin(uid, access_token));
    dispatch(setClubes(resp.data));
  };

  return (
    <ClubeLayout>
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
            <Typography sx={{ mt: "1%", mb: "1%" }} variant="h2">
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
          md={12}
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
