import { CircularProgress, Grid } from "@mui/material";

const CheckingAuth = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems={"center"}
      justifyContent="center"
      sx={{ backgroundColor: "primary.main", padding: 4 }}
    >
      <Grid container direction="row" justifyContent="center">
        <CircularProgress color="warning" />
      </Grid>
    </Grid>
  );
};

export default CheckingAuth;
