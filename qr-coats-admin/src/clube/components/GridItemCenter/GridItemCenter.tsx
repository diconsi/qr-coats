import { Grid } from "@mui/material";
import { FC, ReactNode } from "react";

interface IGridItemCenter {
  children: ReactNode;
}

const GridItemCenter: FC<IGridItemCenter> = ({ children }) => {
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
