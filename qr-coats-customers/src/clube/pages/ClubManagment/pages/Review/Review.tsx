import { useAppSelector, useFetchAndLoad } from "@/hooks";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShareIcon from "@mui/icons-material/Share";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";

import MuiAlert from "@mui/material/Alert";

import { CustomButton } from "@/clube/components";
import { uploadFile } from "@/firebase/config";
import { sendCustomEmail } from "@/services";
import { Dispatch, FC, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { QRCode } from "react-qrcode-logo";

interface ReviewProps {
  setActiveStep: Dispatch<React.SetStateAction<number>>;
}

interface IService {
  id: string;
  name: string;
}
interface IQR {
  email: string;
  name: string;
  paymentStatus: boolean;
  services: [IService];
  orderId: string;
  _id: string;
}

const Review: FC<ReviewProps> = ({ setActiveStep }) => {
  const { callEndpoint } = useFetchAndLoad();
  const { order, activeClub } = useAppSelector((store) => store.clubState);
  const { access_token } = useAppSelector((store) => store.authState);
  const { icon, iconQrVisible } = activeClub;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [openSnack, setOpenSnack] = useState(false);
  const handleOpenSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  const handleSlideChange = (selectedIndex: number) => {
    setCurrentSlideIndex(selectedIndex);
  };

  const onNew = () => {
    setActiveStep(0);
  };

  const onShare = async (): Promise<void> => {
    const { email } = order[currentSlideIndex];
    const canvas = document.getElementById(
      "qr-code"
    ) as HTMLCanvasElement | null;

    if (canvas) {
      const pngBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(null);
          }
        }, "image/png");
      });

      if (pngBlob) {
        const downloadURL = await uploadFile(pngBlob, "QR");
        const { status } = await callEndpoint(
          sendCustomEmail({ email, urlImage: downloadURL }, access_token)
        );
        if (status === 201) handleOpenSnack();
      }
    }
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (order.length === 0) {
    return <CircularProgress color="success" />;
  }

  return (
    <Grid
      display="flex"
      justifyContent="center"
      alignItems="center"
      container
      sx={{ height: "90%" }}
    >
      <Grid
        container
        justifyContent="center"
        sx={{ width: "100%", height: "80%" }}
      >
        <Carousel
          style={{ width: "100%" }}
          interval={null}
          activeIndex={currentSlideIndex}
          onSelect={handleSlideChange}
        >
          {order.map((qr: IQR) => {
            const serviceNames = qr.services.map((service) => service.name);
            const concatenatedNames = serviceNames.join(" & ");
            return (
              <Carousel.Item
                key={qr.name}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Grid
                  container
                  justifyContent="center"
                  sx={{ height: "100%", pt: 4 }}
                >
                  <Grid
                    container
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ height: "70%" }}
                  >
                    <QRCode
                      id="qr-code"
                      logoImage={iconQrVisible ? icon : ""}
                      logoHeight={40}
                      logoWidth={35}
                      logoPadding={1}
                      value={`${qr.orderId}-${qr._id}`}
                      enableCORS={true}
                    />
                    <Typography
                      sx={{ color: "white" }}
                      mt={2}
                    >{`${qr.name}´S ${concatenatedNames}`}</Typography>
                  </Grid>
                </Grid>
                <Carousel.Caption
                  style={{
                    top: "75%",
                    padding: "0px",
                    bottom: "0px",
                    color: "white",
                  }}
                >
                  <h5>{concatenatedNames}</h5>
                </Carousel.Caption>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </Grid>

      <Grid
        container
        sx={{
          width: { md: "20%", xs: "100%" },
          justifyContent: "center",
          height: "20%",
        }}
      >
        <IconButton sx={{ color: "white" }}>
          <WalletIcon fontSize="large" />
        </IconButton>
        <IconButton sx={{ color: "white" }} onClick={onShare}>
          <ShareIcon fontSize="large" style={{ cursor: "pointer" }} />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <ReceiptIcon fontSize="large" />
        </IconButton>
        <IconButton sx={{ color: "white" }} onClick={handleOpen}>
          <AddIcon fontSize="large" />
        </IconButton>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            color: "white",
            backgroundColor: "#2E2F47",
            backdropFilter: "blur(90px)",
          }}
        >
          ATTENTION!
        </DialogTitle>
        <DialogContent
          sx={{
            color: "white",
            backgroundColor: "#2E2F47",
            backdropFilter: "blur(90px)",
            paddingTop: "20px !important",
          }}
        >
          Do you really want to go back to the item selection screen?
        </DialogContent>
        <DialogActions
          sx={{
            color: "white",
            backgroundColor: "#2E2F47",
            backdropFilter: "blur(90px)",
          }}
        >
          <CustomButton
            fullWidth={false}
            label="CANCEL"
            onClick={handleClose}
          />
          <CustomButton
            style={{ marginLeft: "5px" }}
            fullWidth={false}
            label="GO"
            onClick={onNew}
            background="linear-gradient(to bottom, #A482F2, #8CABF0)"
          />
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="success"
        >
          EMAIL SENT SUCCESSFULLY
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

export default Review;
