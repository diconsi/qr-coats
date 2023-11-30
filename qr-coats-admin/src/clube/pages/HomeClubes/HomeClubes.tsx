import { IClub } from "@/clube/interfaces";
import { ClubeLayout } from "@/clube/layout";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import { getClubesByAdmin } from "@/services";
import { setClubes } from "@/store/club/clubSlice";
import SearchIcon from "@mui/icons-material/Search";
import { Grid, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClubCard from "./components/ClubCard";

const HomeClubes = () => {
  const dispatch = useDispatch();
  const { callEndpoint } = useFetchAndLoad();
  const { uid, access_token } = useSelector((store) => store.authState);
  const { clubes } = useSelector((store) => store.clubState);
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
      <Grid
        container
        alignItems="center"
        direction="column"
        sx={{ height: "20%" }}
      >
        <TextField
          id="filled-basic"
          sx={{ width: { xs: "100%", md: "40%" }, height: "10%", mt: 2 }}
          label="Find club"
          variant="filled"
          name="username"
          color="primary"
          onChange={(e) => setSearchClube(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment variant="standard" position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid
        container
        sx={{ width: "100%", overflowY: "scroll", height: "80%" }}
      >
        {clubes
          .filter((club: IClub) =>
            club.name.toLowerCase().includes(searchClube.toLowerCase())
          )
          .map((club: IClub) => (
            <ClubCard club={club} key={club._id} />
          ))}
      </Grid>
    </ClubeLayout>
  );
};

export default HomeClubes;
