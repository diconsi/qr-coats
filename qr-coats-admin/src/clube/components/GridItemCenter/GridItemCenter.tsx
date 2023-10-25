import { Grid } from "@mui/material";

const GridItemCenter = ({ children }) => {
  return (
    <Grid
      item
      md={6}
      xs={12}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%", width: "100%" }}
    >
      {children}
    </Grid>
  );
};

export default GridItemCenter;
