import { IClub } from "@/clube/interfaces";
import { clubProfilePath } from "@/constants";
import { useRedirectTo } from "@/hooks";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";

import { setActiveClub } from "@/store/club/clubSlice";
import { Card, CardMedia, Grid } from "@mui/material";
import { useDispatch } from "react-redux";

const ClubCard = ({ club }) => {
  const { id, icon } = club;
  const dispatch = useDispatch();
  const redirectTo = useRedirectTo();
  const handleItem = async () => {
    dispatch(setActiveClub(club));
    redirectTo(clubProfilePath);
  };

  return (
    <Grid
      item
      xs={12}
      sm={4}
      key={id}
      onClick={handleItem}
      sx={{ mt: 2, display: "flex", justifyContent: "center" }}
    >
      <Card
        variant="outlined"
        sx={{
          backgroundColor: "primary.main",
          height: "40vh",
          width: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardMedia
          component="img"
          image={icon}
          alt="Club Icon"
          sx={{
            height: "50%",
            width: "70%",
            objectFit: "contain",
          }}
        />
      </Card>
    </Grid>
  );
};

export default ClubCard;
