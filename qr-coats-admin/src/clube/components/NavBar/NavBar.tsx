import { useAppDispatch } from "@/hooks";
import { setViewSidebar } from "@/store/auth/authSlice";
import { MenuOutlined } from "@mui/icons-material";
import { AppBar, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
interface INavBar {
  drawerWidth: number;
}

const NavBar: FC<INavBar> = ({ drawerWidth }) => {
  const dispatch = useAppDispatch();

  const onSidebar = () => {
    dispatch(setViewSidebar());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        ml: `${drawerWidth}px)`,
        height: "8vh",
        bgcolor: "#2C313F",
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
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
