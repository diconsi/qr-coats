import { homeClubesPath, profilePath, receiptHistoryPath } from "@/constants";
import { useAppDispatch, useAppSelector, useRedirectTo } from "@/hooks";
import { logout, setViewSidebar } from "@/store/auth/authSlice";
import { setActiveClub } from "@/store/club/clubSlice";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import PowerIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import MonetizationIcon from '@mui/icons-material/MonetizationOnOutlined';
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
} from "@mui/material";
import { FC, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://3.19.76.186:3000");

interface ISidebar {
  drawerWidth: number;
}

const SideBar: FC<ISidebar> = ({ drawerWidth }) => {
  const dispatch = useAppDispatch();

  const redirectTo = useRedirectTo();
  const { openSidebar, photoURL } = useAppSelector((store) => store.authState);

  const { activeClub } = useAppSelector((store) => store.clubState);

  useEffect(() => {
    socket.on("clube", (data) => {
      if (activeClub !== null) {
        if (data._id === activeClub._id) {
          dispatch(setActiveClub(data));
        }
      }
    });
  }, []);

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
            bgcolor: "transparent",
            backdropFilter: "blur(99px)",
            boxShadow: "inset -2px 0 10px rgba(85, 98, 112, 0.8)"
          },
        }}
      >
        <Toolbar sx={{ display: "flex", flexDirection: "column", m: 2 }}>
          <Avatar
            src={photoURL || ""}
            sx={{ width: 100, height: 100, border: "2px solid white" }}
          />
        </Toolbar>
        <Divider />
        <List>
          {[
            {
              id: 1,
              name: "HOME",
              path: homeClubesPath,
              icon: <HomeIcon fontSize="medium" sx={{ color: "white" }} />,
            },
            {
              id: 2,
              name: "PROFILE",
              path: profilePath,
              icon: <PersonIcon fontSize="medium" sx={{ color: "white" }} />,
            },
            {
              id: 3,
              name: "PURCHASE HISTORY",
              path: receiptHistoryPath,
              icon: <MonetizationIcon fontSize="medium" sx={{ color: "white" }} />,
            },
          ].map((item) => (
            <ListItem key={item.id} disablePadding>
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
                  <ListItemText sx={{marginLeft:'-20px'}}  primary={item.name} />
                </Grid>
              </ListItemButton>
            </ListItem>
          ))}
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
              <ListItemText sx={{marginLeft:'-20px'}}  primary={"LOGOUT"} />
            </Grid>
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
};

export default SideBar;
