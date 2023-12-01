import { logout, setViewSidebar } from "@/store/auth/authSlice";
import { LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import { AppBar, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
const NavBar = ({ drawerWidth }) => {
  const { activeClub } = useSelector((store) => store.clubState);

  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout({}));
  };

  const onSidebar = () => {
    dispatch(setViewSidebar());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        ml: `${drawerWidth}px)`,
        height: "10vh",
      }}
    >
      <Toolbar>
        <IconButton onClick={onSidebar} color="inherit" sx={{ mr: 2 }}>
          <MenuOutlined />
        </IconButton>

        <Grid
          container
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" textAlign="center" noWrap component="div">
            QR COATS ADMIN
          </Typography>
          <IconButton color="error" onClick={onLogout}>
            <LogoutOutlined />
          </IconButton>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
