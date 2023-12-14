import { IChildren } from "@/models";
import { Box } from "@mui/material";
import { FC } from "react";
import { NavBar, SideBar } from "../components";

const drawerWidth = 240;
const ClubeLayout: FC<IChildren> = ({ children }) => {
  return (
    <Box
      sx={{ display: "flex", width: "100vw", background: "#22252F" }}
      component="div"
    >
      <NavBar drawerWidth={drawerWidth} />
      <SideBar drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          height: "100vh",
          width: "100%",
          padding: "8vh 0vh 0vh 0vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ClubeLayout;
