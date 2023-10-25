import { FirebaseDB } from "@/firebase/config";
import { startLogout } from "@/store/auth";
import { setViewSidebar } from "@/store/auth/authSlice";
import { setActiveClub, setClubes } from "@/store/club/clubSlice";
import { LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import { AppBar, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { collection, collectionGroup, onSnapshot, query } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const NavBar = ({ drawerWidth }) => {
  const { isAnonymous } = useSelector(store => store.authState);
  const { activeClub } = useSelector(store => store.clubState);
  useEffect(() => {
    const clubesQuery = query(collectionGroup(FirebaseDB,'clubes'));
    const unsubscribe = onSnapshot(clubesQuery,
      (snapShot) => {
       try {
        const clubesData = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // dispatch(setClubes(clubesData));

        const modifiedClub = snapShot
          .docChanges()
          .find(
            (change) =>
              change.type === "modified" && change.doc.id === activeClub.id
          );

        if (modifiedClub) {
          dispatch(
            setActiveClub({
              id: modifiedClub.doc.id,
              ...modifiedClub.doc.data(),
            })
          );
        }
       } catch (error) {
        console.log(error)
       }
      }
    );

    return () => unsubscribe();
  }, []);
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(startLogout());
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
        {!isAnonymous && (
          <IconButton onClick={onSidebar} color="inherit" sx={{ mr: 2 }}>
            <MenuOutlined />
          </IconButton>
        )}
        <Grid
          container
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" textAlign="center" noWrap component="div">
            QR COATS CUSTOMERS
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            noWrap
            component="div"
          ></Typography>
          <IconButton color="error" onClick={onLogout}>
            <LogoutOutlined />
          </IconButton>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
