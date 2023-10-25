import { Grid, Typography } from "@mui/material";

const ContainerBorder = ({
  title,
  children,
  width = "80%",
  height = "90%",
  padding = "2px",
}) => {
  return (
    <Grid
      container
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        position: "relative",
        width: { width },
        height: { height },
        padding: { padding },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: -6,
          transform: "translate(12px, -10px) scale(0.75)",
          backgroundColor: "#fff",
        }}
      >
        {title}
      </Typography>
      {children}
    </Grid>
  );
};

export default ContainerBorder;
