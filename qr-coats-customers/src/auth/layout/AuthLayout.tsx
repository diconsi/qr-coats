import fondo from "@/assets/introMovil.png";
import qrIcon from "@/assets/logoQrCoats.png";
import { Grid, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface IAuthLayout {
  children: ReactNode;
  title?: string;
}

const AuthLayout: FC<IAuthLayout> = ({ children, title = "" }) => {
  const style = {
    backgroundImage: `url(${fondo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <Grid
      container
      style={style}
      width={"100vw"}
      height={"100vh"}
      sx={{ borderStyle: "dashed" }}
    >
      {/* <Grid
        container
        sx={{
          height: "30%",
          mt: 4,
         
        }}
        justifyContent={"center"}
      >
        <img src={qrIcon} style={{ border: "none", height: "100%" }} />
      </Grid> */}
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 4,
            paddingRight: 4,
            textAlign: "center",
          }}
        >
          <Grid container mb={2}>
            <img src={qrIcon} style={{ border: "none", width: "100%" }} />
          </Grid>
          <Grid>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold !important",
                color: "#B8BCFE",
              }}
            >
              {title}
            </Typography>
          </Grid>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
