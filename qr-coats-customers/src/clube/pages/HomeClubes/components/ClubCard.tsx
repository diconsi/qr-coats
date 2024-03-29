import { IClub } from "@/clube/interfaces";
import { clubManagmentPath } from "@/constants";
import { useRedirectTo } from "@/hooks";
import { setActiveClub } from "@/store/club/clubSlice";
import { Avatar, Card, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

const ClubCard = ({ club }: { club: IClub }) => {
  const dispatch = useDispatch();
  const redirectTo = useRedirectTo();

  const handleItem = async () => {
    dispatch(setActiveClub(club));
    redirectTo(clubManagmentPath);
  };

  return (
    <Grid
      item
      xs={6}
      sm={6}
      onClick={handleItem}
      sx={{
        width: "100%",
        height: "35%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 1
      }}
    >
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "90%",
          borderRadius: "25%",
          bgcolor:'#71718A',
          position:'relative'
        }}
      >
        <Typography sx={{top:8,position:'absolute'}}>{club.name.toUpperCase()}</Typography>
        <Avatar
          src={club.icon}
          alt="Club Icon"
          sx={{
            objectFit: "cover",
            width: 100,
            height: 100,
          }}
        />
      </Card>
    </Grid>
  );
};

export default ClubCard;
