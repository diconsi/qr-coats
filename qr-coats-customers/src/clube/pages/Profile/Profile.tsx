import { ClubeLayout } from "@/clube/layout";
import { userDataPath } from "@/constants";
import { useRedirectTo } from "@/hooks";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FaceRetouchingNaturalOutlinedIcon from "@mui/icons-material/FaceRetouchingNaturalOutlined";
import { Grid, Icon, IconButton } from "@mui/material";

const Profile = () => {
  const redirectTo = useRedirectTo();

  const handleEdit = () => {
    redirectTo(userDataPath);
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
        sx={{ padding: "2%", backgroundColor: "primary.main" }}
      >
        <Grid
          container
          width={{ md: "50%", xs: "100%" }}
          bgcolor={"secondary.main"}
          borderRadius={8}
          sx={{ p: 5, border: "2px solid #B8BCFE" }}
        >
          <Grid item xs={10} md={8}>
            <Grid container width={"100%"}>
              <Grid
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-start"}
                item
                xs={2}
                md={2}
              >
                <Icon
                  sx={{
                    width: { md: "50px", xs: "30px" },
                    height: { md: "50px", xs: "30px" },
                    color: "#B8BCFE",
                  }}
                >
                  <FaceRetouchingNaturalOutlinedIcon />
                </Icon>
              </Grid>
              <Grid
                item
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                textAlign={"center"}
                xs={10}
                md={10}
              >
                PERSONAL INFORMATION
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2} md={4} display="flex" justifyContent="flex-end">
            <IconButton sx={{ color: "#B8BCFE" }} onClick={handleEdit}>
              <EditOutlinedIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </ClubeLayout>
  );
};

export default Profile;
