import { ClubeLayout } from "@/clube/layout";
import { userCardsPath, userDataPath } from "@/constants";
import { useRedirectTo } from "@/hooks";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";
import { Grid, Icon, IconButton, Typography } from "@mui/material";

const Profile = () => {
  const redirectTo = useRedirectTo();

  const handleEdit = (path: string) => {
    redirectTo(path);
  };

  return (
    <ClubeLayout>
      <Grid
        container
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ padding: "2%", background: "#EDEDED" }}
      >
        <Grid
          container
          width="50%"
          bgcolor={"white"}
          sx={{ borderRadius: "6px", p: 5 }}
        >
          <Grid item md={8}>
            <Grid container>
              <Grid item md={2}>
                <Icon sx={{ width: "50px", height: "50px" }}>
                  <FaceRetouchingNaturalOutlinedIcon />
                </Icon>
              </Grid>
              <Grid item md={10}>
                <Typography variant="h6"> Datos Personales</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} display="flex" justifyContent="flex-end">
            <IconButton onClick={() => handleEdit(userDataPath)}>
              <EditOutlinedIcon />
            </IconButton>
          </Grid>
          <Grid item md={8}>
            <Grid container>
              <Grid item md={2}>
                <Icon sx={{ width: "50px", height: "50px" }}>
                  <AddCardOutlinedIcon />
                </Icon>
              </Grid>
              <Grid item md={10}>
                <Typography variant="h6"> Tarjetas</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} display="flex" justifyContent="flex-end">
            <IconButton onClick={() => handleEdit(userCardsPath)}>
              <EditOutlinedIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </ClubeLayout>
  );
};

export default Profile;
