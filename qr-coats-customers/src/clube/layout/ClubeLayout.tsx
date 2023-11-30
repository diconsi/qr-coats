import { Box, BoxProps } from "@mui/material";
import { NavBar, SideBar } from "../components";
import { FC, ReactNode } from "react";
import fondo from "@/assets/introMovil.png";
interface IClubeLayout {
  children: ReactNode;
}

const drawerWidth = 240;
const ClubeLayout: FC<IClubeLayout> = ({ children }) => {
  const boxStyle: BoxProps["style"] = {
    backgroundImage: `url(${fondo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflowY: "auto",
    height: "100vh",
  };
  return (
    <Box
      sx={{ display: "flex", width: "100vw" }}
      component="div"
      style={boxStyle}
    >
      <NavBar drawerWidth={drawerWidth} />
      <SideBar drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          height: "100vh",
          width: "100vw",
          padding: "8vh 0vh 0vh 0vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ClubeLayout;
