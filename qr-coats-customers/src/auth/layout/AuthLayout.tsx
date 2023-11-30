import { Grid, Typography } from "@mui/material";
import qrIcon from "@/assets/logoQrCoats.png";
import { FC, ReactNode } from "react";
import fondo from "@/assets/introMovil.png";

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
    <Grid container style={style} width={"100vw"} height={"100vh"}>
      <Grid
        container
        sx={{
          height: "30%",
          mt: 4,
        }}
        justifyContent={"center"}
      >
        <img src={qrIcon} style={{ border: "none", height: "100%" }} />
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "70%",
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
