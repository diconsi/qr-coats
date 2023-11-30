import { Grid, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { CustomButton } from "..";

interface IHeaderSection {
  title: string;
  titleButton: string;
  onClick: () => void;
  icon: ReactNode;
  disableButton?: boolean;
}

const HeaderSectionPage: FC<IHeaderSection> = ({
  title,
  titleButton,
  onClick,
  icon,
  disableButton = false,
}) => {
  const handleButton = () => {
    onClick();
  };
  return (
    <Grid
      container
      width={"100%"}
      height={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{ pt: 2 }}
    >
      <Grid item xs={6} textAlign={"center"}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={6} textAlign={"center"}>
        <CustomButton
          startIcon={icon}
          label={titleButton}
          onClick={handleButton}
          disabled={disableButton}
        />
      </Grid>
    </Grid>
  );
};

export default HeaderSectionPage;
