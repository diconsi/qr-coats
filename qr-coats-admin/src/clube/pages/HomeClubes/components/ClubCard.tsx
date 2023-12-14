import { IClub } from "@/clube/interfaces";
import { clubProfilePath } from "@/constants";
import { useRedirectTo } from "@/hooks";
import { setActiveClub } from "@/store/club/clubSlice";
import { Avatar, Card, Grid } from "@mui/material";
import { useDispatch } from "react-redux";

const ClubCard = ({ club }: { club: IClub }) => {
  const dispatch = useDispatch();
  const redirectTo = useRedirectTo();

  const handleItem = async () => {
    dispatch(setActiveClub(club));
    redirectTo(clubProfilePath);
  };

  return (
    <Grid
      item
      xs={6}
      sm={3}
      onClick={handleItem}
      sx={{
        width: "100%",
        height: "60%",
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
          bgcolor:'#71718A'
        }}
      >
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
