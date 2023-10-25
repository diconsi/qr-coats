import { Alert, Button, Grid, Paper, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { ISummary } from "../Services";

interface IservicesSection {
  summary: ISummary[];
  setSummary: Dispatch<SetStateAction<ISummary[]>>;
  promotion: { name: string; price: number; status: boolean };
}

const ServicesSection = ({
  summary,
  setSummary,
  promotion,
}: IservicesSection) => {
  const { name, price, status } = promotion;
  const handleServiceChange = (serviceId: number, changeAction: number) => {
    const updatedSummary = summary.map((item) => {
      if (item.id === serviceId) {
        const updatedTotal = item.total + changeAction;
        return updatedTotal >= 0 ? { ...item, total: updatedTotal } : null;
      }
      return item;
    });

    setSummary(updatedSummary.filter((item) => item.total >= 0));
  };
  return (
    <Grid item xs={12} md={6} sx={{ height: "75%" }}>
      <Paper elevation={2} sx={{ height: "100%" }}>
        {summary
          .map((item) => (
            <Grid
              key={item.id}
              container
              alignItems="center"
              sx={{ height: "25%" }}
            >
              <Grid
                item
                display="flex"
                alignItems="center"
                justifyContent="center"
                xs={6}
                md={6}
              >
                <img src={item.icon} width={50} height={50} />
                <Typography sx={{ ml: 1 }}>
                  {item.name} ${item.price}
                </Typography>
              </Grid>
              <Grid
                item
                display="flex"
                alignItems="center"
                justifyContent="center"
                xs={6}
                md={6}
              >
                <Button
                  onClick={() => handleServiceChange(item.id, 1)}
                  variant="contained"
                >
                  +
                </Button>
                {item.total}
                <Button
                  onClick={() => handleServiceChange(item.id, -1)}
                  variant="contained"
                >
                  -
                </Button>
              </Grid>
            </Grid>
          ))
          .filter((item) => item.id !== "0003")}
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{ height: "50%" }}
        >
          <Alert
            variant="filled"
            sx={{ display: status ? "" : "none" }}
            severity="info"
          >
            <Typography textAlign="center">
              We have the combo promotion
            </Typography>
            <Typography textAlign="center" variant="h6">
              {name} = ${price}
            </Typography>
          </Alert>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ServicesSection;
