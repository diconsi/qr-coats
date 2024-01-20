import { CustomButton } from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { useAppDispatch, useAppSelector, useFetchAndLoad } from "@/hooks";
import { createOrder } from "@/services/order.services";
import {
  setActiveReceipt,
  setOrder,
  setServices,
} from "@/store/club/clubSlice";
import CheckedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Grid, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Payment, Review, Services } from "./pages";
import { fileClon } from "@/tools";
import { uploadFile } from "@/firebase/config";
interface ICustomStepIcon {
  completed: boolean;
}

interface IQrData {
  qr: object;
  order: object;
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
    const qrUpdated = await Promise.all(
      qrList.map(async (qr) => {
        const { photo } = qr;
        if (photo) {
          const response = await fetch(photo);
          const blob = await response.blob();
          const file = fileClon(blob, uid, "image/jpeg");
          const url = await uploadFile(file, "customers");
          return { ...qr, photo: url };
        } else {
          return qr;
        }
      })
    );

    const data = {
      clubId: _id,
      creator: uid,
      qr: qrUpdated,
      totals,
      paymentStatus: false,
      paymentType: "PHYSICAL",
    };

    const {
      data: { qr, order },
    } = (await callEndpoint(createOrder(access_token, data))) as {
      data: IQrData;
    };
    dispatch(setActiveReceipt(order));
    dispatch(setOrder(qr));
    dispatch(setServices({ services: [], promotion: {} }));
    setActiveStep(2);
  };

  const onPayCheckout = async () => {
    const qrUpdated = await Promise.all(
      qrList.map(async (qr) => {
        const { photo } = qr;
        if (photo) {
          const response = await fetch(photo);
          const blob = await response.blob();
          const file = fileClon(blob, uid, "image/jpeg");
          const url = await uploadFile(file, "customers");
          return { ...qr, photo: url };
        } else {
          return qr;
        }
      })
    );
    const data = {
      clubId: _id,
      creator: uid,
      qr: qrUpdated,
      totals,
      paymentStatus: true,
      paymentType: "DIGITAL",
    };
    const {
      data: { qr, order },
    } = (await callEndpoint(createOrder(access_token, data))) as {
      data: IQrData;
    };
    dispatch(setActiveReceipt(order));
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
    if (location.search !== "" && activeStep !== 2) {
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
              mt={3}
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
                      <span style={{ color: "white" }}> {label}</span>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
          </Grid>
          <Grid container sx={{ height: "70%" }}>
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
