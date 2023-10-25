import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";
export const theme = createTheme({
  palette: {
    primary: {
      main: "#6329e6",
    },
    secondary: {
      main: "#543844",
    },
    error: {
      main: red.A400,
    },
  },
});
