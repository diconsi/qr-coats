import { useAppSelector, useFetchAndLoad, useRedirectTo } from "@/hooks";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReturnIcon from "@mui/icons-material/KeyboardReturnOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShareIcon from "@mui/icons-material/Share";
import {
  Alert,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";

import MuiAlert from "@mui/material/Alert";

import { InputText } from "@/clube/components";
import DialogComponent from "@/clube/components/DialogComponent/DialogComponent";
import { tableHistoryPath } from "@/constants";
import { uploadFile } from "@/firebase/config";
import { sendCustomEmail } from "@/services";
import { stateValidator } from "@/tools";
import Add from "@mui/icons-material/AddCircle";
import { Dispatch, FC, MouseEvent, useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { QRCode } from "react-qrcode-logo";
import { Delete } from "@mui/icons-material";

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

interface ValidationRules {
  [key: string]: (value: string) => boolean;
}

const validationRules: ValidationRules = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof value === "string" && value !== "" && emailRegex.test(value);
  },
};

const Review: FC<ReviewProps> = ({ setActiveStep }) => {
  const { callEndpoint } = useFetchAndLoad();
  const redirectTo = useRedirectTo();
  const { order, activeClub } = useAppSelector((store) => store.clubState);
  const { access_token } = useAppSelector((store) => store.authState);
  const { icon, iconQrVisible } = activeClub;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const sendEmails = async () => {
      await Promise.all(
        order.map(async (qr, index) => {
          const { email } = qr;
          const canvas = document.getElementById(
            `qr-code-${index}`
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

              if (status === 201) {
                console.log(`Correo enviado a ${email}`);
              }
            }
          }
        })
      );
    };
    sendEmails();
  }, [order, access_token]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEmails([]);
    setEmail("");
  };

  const [titleModal, setTitleModal] = useState("");

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

  const onShare = async (opcion: string): Promise<void> => {
    const mensaje = "Enter the link to obtain your QR";
    const canvas = document.getElementById(
      `qr-code-${currentSlideIndex}`
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
        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
          `${mensaje} ${downloadURL}`
        )}`;

        if (opcion === "whatsapp") {
          window.open(whatsappLink, "_blank");
        } else {
          try {
            const promesasEnvio = emails.map(async (email) => {
              try {
                await callEndpoint(
                  sendCustomEmail(
                    { email, urlImage: downloadURL },
                    access_token
                  )
                );
              } catch (error) {
                console.error(`Error al enviar el correo a ${email}:`, error);
              }
            });
            try {
              await Promise.all(promesasEnvio);
              handleOpenSnack();
              handleCloseDialog();
              handleClose();
            } catch (error) {
              console.error(
                "Hubo un error al enviar uno o más correos electrónicos:",
                error
              );
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  };

  const handleOpenModal = (titleModal: string) => {
    setTitleModal(titleModal);
    setOpenDialog(true);
  };

  const addEmail = () => {
    const newErrors = stateValidator({ email: email }, validationRules);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      console.log([...emails, email]);
      setEmails([...emails, email]);
      setEmail("");
    }
  };

  const onSendEmail = () => {
    onShare("EMAIL");
  };

  const handleDelete = (index: string) => {
    const updatedEmails = emails.filter((email) => email !== index);
    setEmails(updatedEmails);
  };

  const renderContent = () => {
    const message =
      titleModal === "ATTENTION!"
        ? "Do you really want to go back to the item selection screen?"
        : "Do you really want to share your Qr on WhatsApp?";
    return (
      <Grid container width={"100%"}>
        {titleModal === "EMAIL" ? (
          <Grid item width={"100%"}>
            <Grid container width={"100%"}>
              <Grid item xs={12}>
                <InputText
                  placeholder="Enter Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  endAdornmentIcon={<Add />}
                  onClickIcon={addEmail}
                />
              </Grid>
            </Grid>
            {emails.map((email, index) => (
              <Chip
                key={index}
                sx={{
                  bgcolor: "#656581",
                  color: "white",
                  mt: 2,
                  mr: 0.5,
                }}
                label={email}
                onDelete={() => handleDelete(email)}
                variant="outlined"
                deleteIcon={<Delete sx={{ color: "white !important" }} />}
              />
            ))}
          </Grid>
        ) : (
          <Alert
            severity="error"
            sx={{
              borderRadius: "30px",
              bgcolor: "#D5E7FF",
              color: "#2B2E3A",
              fontSize: "10PX",
              alignItems: "center",
            }}
          >
            {message.toUpperCase()}
          </Alert>
        )}
      </Grid>
    );
  };

  const handleClickHistory = () => {
    redirectTo(tableHistoryPath);
  };

  const renderActionButton = () => {
    switch (titleModal) {
      case "EMAIL":
        return onSendEmail();
      case "ATTENTION!":
        return onNew();
      default:
        break;
    }
  };

  const renderLabelButton = () => {
    switch (titleModal) {
      case "EMAIL":
        return "SEND";
      default:
        return "GO";
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
          {order.map((qr: IQR, index) => {
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
                      id={`qr-code-${index}`}
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
        <IconButton sx={{ color: "white" }} onClick={handleClick}>
          <ShareIcon fontSize="large" style={{ cursor: "pointer" }} />
        </IconButton>
        <Menu
          sx={{
            "& .MuiMenu-list": {
              backgroundColor: "#2E2F47",
            },
          }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            sx={{ backgroundColor: "#2E2F47" }}
            onClick={() => onShare("whatsapp")}
          >
            WhatsApp
          </MenuItem>
          <MenuItem
            sx={{ backgroundColor: "#2E2F47" }}
            onClick={() => handleOpenModal("EMAIL")}
          >
            Email
          </MenuItem>
        </Menu>
        <IconButton sx={{ color: "white" }} onClick={handleClickHistory}>
          <ReceiptIcon fontSize="large" />
        </IconButton>
        <IconButton
          sx={{ color: "white" }}
          onClick={() => handleOpenModal("ATTENTION!")}
        >
          <ReturnIcon fontSize="large" />
        </IconButton>
      </Grid>

      <DialogComponent
        open={openDialog}
        onClose={handleCloseDialog}
        title={titleModal}
        content={renderContent()}
        labelBotton={renderLabelButton()}
        onActionButton={renderActionButton}
      />
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
