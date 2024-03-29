import qrIcon from "@/assets/Icon-192.png";
import { currentEnpoint } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logout, setViewSidebar } from "@/store/auth/authSlice";
import { setActiveClub } from "@/store/club/clubSlice";
import { MenuOutlined } from "@mui/icons-material";
import PowerIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import { AppBar, Grid, IconButton, Toolbar } from "@mui/material";
import { FC, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io(currentEnpoint);

interface INavBar {
  drawerWidth: number;
}

const NavBar: FC<INavBar> = ({ drawerWidth }) => {
  const { activeClub } = useAppSelector((store) => store.clubState);
  const { isAnonymous, name } = useAppSelector((store) => store.authState);

  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on("clube", (data) => {
      if (activeClub !== null) {
        if (data._id === activeClub._id) {
          dispatch(setActiveClub(data));
        }
      }
    });
  }, []);

  const onSidebar = () => {
    dispatch(setViewSidebar());
  };

  const onLogout = () => {
    dispatch(logout({}));
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        ml: `${drawerWidth}px)`,
        height: "8vh",
        bgcolor: "transparent",
        backdropFilter: "blur(99px)",
      }}
    >
      <Toolbar>
        {!isAnonymous ? (
          <IconButton onClick={onSidebar} color="inherit" sx={{ mr: 2 }}>
            <MenuOutlined />
          </IconButton>
        ) : (
          <IconButton onClick={onLogout}>
            <PowerIcon fontSize="large" sx={{ color: "white" }} />
          </IconButton>
        )}
        <Grid
          container
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ position: "relative" }}
        >
          <span>WELCOME{isAnonymous ? "" : `  ${name.toUpperCase()}`}</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={qrIcon} style={{ border: "none", height: "10vh" }} />
          </div>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
