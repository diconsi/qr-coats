import { uploadFile } from "@/firebase/config";
import { useFetchAndLoad } from "@/hooks";
import { sendCustomEmail } from "@/services";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShareIcon from "@mui/icons-material/Share";
import { CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { QRCode } from "react-qrcode-logo";
import { useSelector } from "react-redux";
const Review = ({ setActiveStep }) => {
  const { callEndpoint } = useFetchAndLoad();
  const { order, activeClub } = useSelector((store) => store.clubState);
  const { icon, iconQrVisible } = activeClub;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { qr } = order;

  const handleSlideChange = (selectedIndex) => {
    setCurrentSlideIndex(selectedIndex);
  };

  const onNew = () => {
    setActiveStep(0);
  };

  const onShare = async () => {
    const { email } = qr[currentSlideIndex];
    const canvas: any = document.getElementById("qr-code");

    if (canvas) {
      const pngBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      const downloadURL = await uploadFile(pngBlob, "QR");
      const { data } = await callEndpoint(
        sendCustomEmail({ email, urlImage: downloadURL })
      );
      console.log(data)
      // sendCustomEmail(email, downloadURL);
    }
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
      sx={{ height: "70%" }}
    >
      <Grid
        container
        justifyContent="center"
        sx={{ width: "100%", height: "80%" }}
      >
        <Carousel
          style={{ width: "50%" }}
          interval={null}
          data-bs-theme="dark"
          activeIndex={currentSlideIndex}
          onSelect={handleSlideChange}
        >
          {qr.map((s) => {
            const serviceNames = s.services.map((service) => service.name);
            const concatenatedNames = serviceNames.join(" & ");
            return (
              <Carousel.Item
                key={s.name}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Grid container justifyContent="center" sx={{ height: "100%" }}>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ height: "70%" }}
                  >
                    <QRCode
                      id="qr-code"
                      logoImage={iconQrVisible && icon}
                      logoHeight={40}
                      logoWidth={35}
                      logoPadding={1}
                      value={`${order.id}/${s.id}`}
                      enableCORS={true}
                    />
                  </Grid>
                  <Grid
                    container
                    justifyContent="center"
                    sx={{ height: "30%" }}
                  >
                    <Typography>{`${s.name}´S ${concatenatedNames}`}</Typography>
                  </Grid>
                </Grid>
                <Carousel.Caption>
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
          height: "20%",
          justifyContent: "center",
        }}
      >
        <IconButton>
          <WalletIcon fontSize="large" />
        </IconButton>

        <IconButton onClick={onShare}>
          <ShareIcon fontSize="large" style={{ cursor: "pointer" }} />
        </IconButton>

        <IconButton>
          <ReceiptIcon fontSize="large" />
        </IconButton>

        <IconButton onClick={onNew}>
          <AddIcon fontSize="large" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default Review;
