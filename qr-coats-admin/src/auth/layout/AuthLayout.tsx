import fondo from "@/assets/loginWeb.png";
import qrIcon from "@/assets/logoQrCoats.png";
import { Grid, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface IAuth {
  children: ReactNode;
  title: string;
}

const AuthLayout: FC<IAuth> = ({ children, title = "" }) => {
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Grid
          container
          width={"50%"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 4,
            paddingRight: 4,
            textAlign: "center",
          }}
        >
          <Grid display={"flex"} justifyContent={"center"} container mb={2}>
            <img src={qrIcon} style={{ border: "none", width: "30%" }} />
          </Grid>
          <Grid
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
          >
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
