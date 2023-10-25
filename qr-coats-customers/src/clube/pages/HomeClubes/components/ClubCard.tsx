import { IClub } from "@/clube/interfaces";
import { clubManagmentPath, registerGuestPath } from "@/constants";
import { useFetchAndLoad, useRedirectTo } from "@/hooks";
import { getClubById } from "@/services";
import { setActiveClub } from "@/store/club/clubSlice";
import { Card, CardMedia, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const ClubCard = ({ club }: { club: IClub }) => {
  const { isAnonymous } = useSelector((store) => store.authState);
  const dispatch = useDispatch();
  const redirectTo = useRedirectTo();

  const handleItem = async () => {
    const bandera = false;

    dispatch(setActiveClub(club));
    bandera ? redirectTo(registerGuestPath) : redirectTo(clubManagmentPath);
  };

  return (
    <Grid
      item
      xs={12}
      sm={4}
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
          src={club.icon}
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
