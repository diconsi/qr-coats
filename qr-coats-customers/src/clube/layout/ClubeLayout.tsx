import { Box, Toolbar } from "@mui/material";
import { NavBar, SideBar } from "../components";

const drawerWidth = 240;
const ClubeLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <NavBar drawerWidth={drawerWidth} />
      <SideBar drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          height: "100vh",
          width: "100%",
          padding: "10vh 0vh 0vh 0vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ClubeLayout;
