import { Button, Stack, Typography } from "@mui/material";
const HeaderSectionPage = ({
  title,
  titleButton,
  onClick,
  icon,
  disableButton = false,
}) => {
  const handleButton = () => {
    debugger
    onClick();
  };
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ height: "20%" }}
    >
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Button
        disabled={disableButton}
        variant="contained"
        onClick={handleButton}
        startIcon={icon}
      >
        {titleButton}
      </Button>
    </Stack>
  );
};

export default HeaderSectionPage;
