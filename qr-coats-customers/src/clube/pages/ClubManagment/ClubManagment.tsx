import { ClubeLayout } from "@/clube/layout";
import { useFetchAndLoad } from "@/hooks";
import { createNewOrder } from "@/services/order.services";
import {
  Button,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Payment, Review, Services } from "./pages";
import { setOrder } from "@/store/club/clubSlice";

const ClubManagment = () => {
  const dispatch = useDispatch();
  const { activeClub, serviceOrder, totals, clubes } = useSelector(
    (store) => store.clubState
  );
  const { uid } = useSelector((store) => store.authState);

  const { name, photo, _id } = activeClub;
  debugger

  const steps = ["Services", "Payment details", "Review your order"];

  const [activeStep, setActiveStep] = useState(0);

  const onCheckOut = () => {
    setActiveStep(2);
  };

  const { callEndpoint } = useFetchAndLoad();

  // const onPayCash = async () => {
  //   const { idAdmin } = clubes.find((club) => club.idClub === _id);

  //   const order = {
  //     idClub: _id,
  //     idAdmin,
  //     customer: uid,
  //     qr: serviceOrder,
  //     totals,
  //   };
  //   const { data } = await callEndpoint(createNewOrder(order));
  //   dispatch(setOrder(data));
  //   setActiveStep(2);
  // };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Services />;
      case 1:
        return <Payment />;
      case 2:
        return <Review setActiveStep={setActiveStep} />;
      default:
        throw new Error("Unknown step");
    }
  };
  return (
    <ClubeLayout>
      <Grid
        container
        alignItems="center"
        direction="column"
        sx={{ height: "100%", width: "100%" }}
      >
        <Paper variant="outlined" sx={{ height: "100%", width: "100%" }}>
          <Grid alignItems="center" container sx={{ height: "20%" }}>
            <Grid item xs={12} md={2}>
              <img src={photo} className="club-image" />
            </Grid>
            <Grid item xs={12} md={10}>
              <Typography component="h1" variant="h4" align="center">
                {name}
              </Typography>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
          </Grid>
          <>
            {getStepContent(activeStep)}
            <Grid
              container
              flexDirection="row"
              alignItems="center"
              sx={{
                height: "10%",
                width: "100%",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Grid sx={{ mr: 2 }} item>
                <Button onClick={onCheckOut} variant="contained">
                  CHECKOUT
                </Button>
              </Grid>

              {activeStep !== 2 && (
                <Grid item>
                  <Button 
                  // onClick={onPayCash} 
                  variant="contained">
                    PAY CASH
                  </Button>
                </Grid>
              )}
            </Grid>
          </>
        </Paper>
      </Grid>
    </ClubeLayout>
  );
};

export default ClubManagment;
