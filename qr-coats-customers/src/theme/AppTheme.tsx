import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { theme } from ".";
import { IChildren } from "@/models";
import { FC } from "react";
const AppTheme: FC<IChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppTheme;
