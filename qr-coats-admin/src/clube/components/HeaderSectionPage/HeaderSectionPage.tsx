import { Grid, Typography } from "@mui/material";
import { CustomButton } from "..";
import { FC, ReactNode } from "react";

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
      display={"flex"}
      justifyContent={"space-between"}
    >
      <Typography sx={{ color: "#677483" }} variant="h4">
        {title}
      </Typography>
      <CustomButton
        startIcon={icon}
        label={titleButton}
        onClick={handleButton}
        disabled={disableButton}
        background="linear-gradient(to bottom, #A482F2, #8CABF0)"
      />
    </Grid>
  );
};

export default HeaderSectionPage;
