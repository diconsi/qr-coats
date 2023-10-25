import {
  clubManagmentPath,
  homeClubesPath,
  profilePath,
  receiptHistoryPath,
} from "@/constants";
import { useRedirectTo } from "@/hooks";
import { setViewSidebar } from "@/store/auth/authSlice";
import { TurnedInNot } from "@mui/icons-material";
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

  const handleMenutItem = (pagePath: string) => {
    redirectTo(pagePath);
    toggleDrawer();
  };

  const toggleDrawer = () => {
    dispatch(setViewSidebar());
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
            { id: 1, name: "Home", path: homeClubesPath },
            { id: 2, name: "Profile", path: profilePath },
            { id: 3, name: "Club Service", path: clubManagmentPath },
            { id: 4, name: "Purchase History", path: receiptHistoryPath },
          ].map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => handleMenutItem(item.path)}>
                <ListItemIcon>
                  <TurnedInNot />
                </ListItemIcon>
                <Grid container>
                  <ListItemText primary={item.name} />
                </Grid>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default SideBar;
