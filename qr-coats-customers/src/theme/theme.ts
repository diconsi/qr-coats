import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";
export const theme = createTheme({
  palette: {
    primary: {
      main: "#22252E",
    },
    secondary: {
      main: "#2C2E3A",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "AttenBold",
    body1: {
      color: "#ffffff",
    },
  },
});
