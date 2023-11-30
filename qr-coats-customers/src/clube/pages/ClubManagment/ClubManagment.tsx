import { CustomButton } from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { useAppDispatch, useAppSelector, useFetchAndLoad } from "@/hooks";
import { createOrder } from "@/services/order.services";
import { setOrder, setServices } from "@/store/club/clubSlice";
import CheckedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Grid, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Payment, Review, Services } from "./pages";
interface ICustomStepIcon {
  completed: boolean;
}

interface IQrData {
  qr: object;
}

const CustomStepIcon: FC<ICustomStepIcon> = ({ completed }) => {
  return completed ? (
    <CheckedIcon fontSize="small" sx={{ color: "white" }} />
  ) : (
    <RadioButtonUncheckedIcon fontSize="small" sx={{ color: "white" }} />
  );
};

const ClubManagment = () => {
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { activeClub, qrList, totals } = useAppSelector(
    (store) => store.clubState
  );
  const emptyQr = qrList.length === 0;

  const { uid, access_token } = useAppSelector((store) => store.authState);

  const { name, photo, _id, withGateway } = activeClub;

  const steps = ["SERVICES", "PAYMENT DETAILS", "GENERATED QR"];

  const [activeStep, setActiveStep] = useState(0);

  const onCheckOut = () => {
    setActiveStep(1);
  };

  const { callEndpoint } = useFetchAndLoad();

  const onPayCash = async () => {
    const data = {
      clubId: _id,
      creator: uid,
      qr: qrList,
      totals,
      paymentStatus: false,
    };

    const {
      data: { qr },
    } = (await callEndpoint(createOrder(access_token, data))) as {
      data: IQrData;
    };

    dispatch(setOrder(qr));
    dispatch(setServices({ services: [], promotion: {} }));
    setActiveStep(2);
  };

  const onPayCheckout = async () => {
    const data = {
      clubId: _id,
      creator: uid,
      qr: qrList,
      totals,
      paymentStatus: true,
    };
    const {
      data: { qr },
    } = (await callEndpoint(createOrder(access_token, data))) as {
      data: IQrData;
    };
    dispatch(setOrder(qr));
    dispatch(setServices({ services: [], promotion: {} }));
    setActiveStep(2);
  };

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

  useEffect(() => {
    if (location.search !== "") {
      onPayCheckout();
    }
  }, [location]);

  const style = {
    backgroundImage: `url(${photo})`,
    backgroundSize: "cover",
  };

  return (
    <ClubeLayout>
      <Grid
        container
        alignItems="center"
        direction="column"
        sx={{ height: "100%", width: "100%" }}
      >
        <Grid
          sx={{
            color: "white",
            width: "100%",
            height: "100%",
          }}
        >
          <Grid
            justifyContent={"center"}
            container
            sx={{ height: "30%", position: "relative" }}
            style={style}
          >
            <Typography
              width={"70%"}
              p={1}
              borderRadius={"30px"}
              bgcolor={"rgba(200, 190, 195, 0.4)"}
              sx={{
                backdropFilter: "blur(10px)",
                position: "absolute",
                top: "0%",
              }}
              textAlign={"center"}
            >
              {name.toLocaleUpperCase()}
            </Typography>
            <Grid
              display={"flex"}
              justifyContent={"center"}
              width={"100%"}
              container
              position={"absolute"}
              bottom={"-10%"}
            >
              <Stepper
                sx={{
                  bgcolor: "rgba(200, 190, 195, 0.4)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "30px",
                  p: 0.5,
                }}
                activeStep={activeStep}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel StepIconComponent={CustomStepIcon}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
          </Grid>
          <Grid container sx={{ height:'70%'}}>
            {getStepContent(activeStep)}
            <Grid
              container
              pt={1}
              pb={1}
              height={"10%"}
              sx={{
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              {withGateway && activeStep === 0 && !emptyQr && (
                <Grid sx={{ mr: 2 }} item>
                  <CustomButton label="CHECKOUT" onClick={onCheckOut} />
                </Grid>
              )}
              {activeStep === 0 && !emptyQr && (
                <Grid item>
                  <CustomButton label="PAY CASH" onClick={onPayCash} />
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid item>
                  <CustomButton label="BACK" onClick={() => setActiveStep(0)} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ClubeLayout>
  );
};

export default ClubManagment;
