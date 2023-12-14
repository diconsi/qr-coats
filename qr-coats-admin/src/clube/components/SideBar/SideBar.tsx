import {
  clubEmployessPath,
  clubLocationsPath,
  clubProfilePath,
  clubSettingsPath,
  homeClubesPath,
} from "@/constants";
import { useAppDispatch, useAppSelector, useRedirectTo } from "@/hooks";
import { logout, setViewSidebar } from "@/store/auth/authSlice";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PowerIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import {
  Box,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { FC } from "react";

interface ISidebar {
  drawerWidth: number;
}

const SideBar: FC<ISidebar> = ({ drawerWidth }) => {
  const dispatch = useAppDispatch();
  const { openSidebar } = useAppSelector((store) => store.authState);
  const redirectTo = useRedirectTo();

  const { activeClub } = useAppSelector((store) => store.clubState);

  const handleMenutItem = (pagePath: string) => {
    redirectTo(pagePath);
    toggleDrawer();
  };

  const toggleDrawer = () => {
    dispatch(setViewSidebar());
  };

  const onLogout = () => {
    dispatch(setViewSidebar());
    dispatch(logout({}));
  };
  return (
    <Box component="nav" sx={{ flexShrink: { sm: 0 } }}>
      <Drawer
        open={openSidebar}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#2C313F",
          },
        }}
      >
        <Toolbar
          sx={{ display: "flex", flexDirection: "column", m: 2 }}
        ></Toolbar>
        <Divider />
        <List>
          {[
            {
              label: "HOME",
              path: homeClubesPath,
              icon: (
                <DashboardOutlinedIcon
                  fontSize="medium"
                  sx={{ color: "white" }}
                />
              ),
            },
            {
              label: "PROFILE",
              path: clubProfilePath,
              icon: (
                <ManageAccountsOutlinedIcon
                  fontSize="medium"
                  sx={{ color: "white" }}
                />
              ),
            },
            {
              label: "EMPLOYEES",
              path: clubEmployessPath,
              icon: (
                <GroupOutlinedIcon fontSize="medium" sx={{ color: "white" }} />
              ),
            },
            {
              label: "LOCATIONS",
              path: clubLocationsPath,
              icon: (
                <MapOutlinedIcon fontSize="medium" sx={{ color: "white" }} />
              ),
            },
            {
              label: "SETTINGS",
              path: clubSettingsPath,
              icon: <SettingsIcon fontSize="medium" sx={{ color: "white" }} />,
            },
          ].map((item) => {
            return activeClub || item.label == "Employees" ? (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  sx={{
                    "&:hover": {
                      backgroundColor: "#B8BCFE",
                    },
                  }}
                  onClick={() => handleMenutItem(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <Grid container>
                    <ListItemText
                      sx={{ marginLeft: "-20px" }}
                      primary={item.label}
                    />
                  </Grid>
                </ListItemButton>
              </ListItem>
            ) : null;
          })}
          <ListItemButton
            sx={{
              "&:hover": {
                backgroundColor: "#B8BCFE",
              },
            }}
            onClick={onLogout}
          >
            <ListItemIcon>
              <PowerIcon fontSize="medium" sx={{ color: "white" }} />
            </ListItemIcon>
            <Grid container>
              <ListItemText sx={{ marginLeft: "-20px" }} primary={"LOGOUT"} />
            </Grid>
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
};

export default SideBar;
