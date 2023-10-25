import {
  clubEmployessPath,
  clubLocationsPath,
  clubProfilePath,
  clubSettingsPath,
  homeClubesPath,
} from "@/constants";
import { useRedirectTo } from "@/hooks";
import { setViewSidebar } from "@/store/auth/authSlice";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import {
  Avatar,
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
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const SideBar = ({ drawerWidth }) => {
  const dispatch = useDispatch();
  const redirectTo = useRedirectTo();
  const { openSidebar, displayName, photoURL } = useSelector(
    (store) => store.authState
  );

  const { activeClub } = useSelector((store) => store.clubState);

  const toggleDrawer = () => {
    dispatch(setViewSidebar());
  };

  const handleMenutItem = (pagePath: string) => {
    redirectTo(pagePath);
    toggleDrawer();
  };

  return (
    <Box component="nav" sx={{ flexShrink: { sm: 0 } }}>
      <Drawer
        open={openSidebar}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <Toolbar sx={{ display: "flex", flexDirection: "column", m: 2 }}>
          <Avatar src={photoURL} sx={{ width: 56, height: 56 }} />
          <Typography noWrap>{displayName}</Typography>
        </Toolbar>
        <Divider />
        <List>
          {[
            {
              label: "Home",
              path: homeClubesPath,
              icon: <DashboardOutlinedIcon />,
            },
            {
              label: "Profile",
              path: clubProfilePath,
              icon: <ManageAccountsOutlinedIcon />,
            },
            {
              label: "Employees",
              path: clubEmployessPath,
              icon: <GroupOutlinedIcon />,
            },
            {
              label: "Locations",
              path: clubLocationsPath,
              icon: <MapOutlinedIcon />,
            },
            {
              label: "Settings",
              path: clubSettingsPath,
              icon: <SettingsIcon />,
            },
          ].map((item) => {
            return activeClub || item.label == "Employees" ? (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => handleMenutItem(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <Grid container>
                    <ListItemText primary={item.label} />
                  </Grid>
                </ListItemButton>
              </ListItem>
            ) : null;
          })}
        </List>
      </Drawer>
    </Box>
  );
};

export default SideBar;
