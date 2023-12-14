import {
  DropzoneInput,
  HeaderSectionPage,
  InputText,
  TimePickerComponent,
} from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { uploadFiles } from "@/firebase/config";
import { useAppSelector } from "@/hooks";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import { updateClube } from "@/services";
import { CheckingAuth } from "@/ui";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import { Container, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { QRCode } from "react-qrcode-logo";

const ClubeProfile = () => {
  const { activeClub } = useAppSelector((store) => store.clubState);
  const { uid, access_token } = useAppSelector((store) => store.authState);
  const { icon, photo, customNote, closingHour, openingHour, iconQrVisible } =
    activeClub;
  const [note, setNote] = useState(customNote);
  const [closing, setClosing] = useState(closingHour);
  const [opening, setOpening] = useState(openingHour);

  const [selectedFileIcon, setSelectedFileIcon] = useState<File | null>(null);
  const [selectedFilePhoto, setSelectedFilePhoto] = useState<File | null>(null);

  const { callEndpoint, loading } = useFetchAndLoad();

  const handleUpdate = async () => {
    let iconClub = null;
    let photoClub = null;

    if (selectedFileIcon) {
      iconClub = await uploadFiles(selectedFileIcon, "logos");
    }

    if (selectedFilePhoto) {
      photoClub = await uploadFiles(selectedFilePhoto, "clubes");
    }

    const newClub: {
      icon?: string | null;
      photo?: string | null;
      customNote: string;
      closingHour: string;
      openingHour: string;
    } = {
      icon: iconClub,
      photo: photoClub,
      customNote: note,
      closingHour: closing,
      openingHour: opening,
    };

    if (!selectedFileIcon) delete newClub.icon;
    if (!selectedFilePhoto) delete newClub.photo;

    const { status } = await callEndpoint(
      updateClube(activeClub._id, newClub, access_token)
    );
    if (status === 200) {
      setSelectedFileIcon(null);
      setSelectedFilePhoto(null);
    }
  };

  return (
    <ClubeLayout>
      {loading ? (
        <CheckingAuth />
      ) : (
        <Grid sx={{ height: "100%", width: "100%", p: 2 }}>
          <Grid
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            item
            width={"100%"}
            height={"10%"}
            p={2}
          >
            <HeaderSectionPage
              title={"SETTINGS"}
              titleButton={"Updated"}
              onClick={handleUpdate}
              icon={<UpdateOutlinedIcon />}
            />
          </Grid>
          <Grid
            container
            sx={{
              height: "90%",
              width: "100%",
              overflowY: { xs: "scroll", md: "initial" },
            }}
          >
            <Grid item md={12} sx={{ height: { md: "50%" } }}>
              <Grid container>
                <Grid item md={4} xs={12} p={2}>
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      p: 3,
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "5px" }}>
                      IMAGE
                    </Typography>
                    <DropzoneInput
                      setSelectedFile={setSelectedFilePhoto}
                      previewIcon={photo}
                    />
                  </Container>
                </Grid>
                <Grid item md={4} xs={12} p={2}>
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      p: 3,
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "5px" }}>
                      QR EMPLOYEE
                    </Typography>
                    <QRCode
                      logoImage={
                        iconQrVisible ? (icon ? icon : undefined) : undefined
                      }
                      logoHeight={35}
                      logoWidth={35}
                      logoPadding={1}
                      value={`https://d2cadzk8as2kud.cloudfront.net/auth/login?adminId==${uid}`}
                    />
                  </Container>
                </Grid>
                <Grid item md={4} xs={12} p={2}>
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      p: 3,
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "5px" }}>
                      QR CLUB
                    </Typography>
                    <QRCode
                      logoImage={
                        iconQrVisible ? (icon ? icon : undefined) : undefined
                      }
                      logoHeight={35}
                      logoWidth={35}
                      logoPadding={1}
                      value={`https://d1cz9ginvjihcr.cloudfront.net`}
                    />
                  </Container>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12} xs={12} sx={{ height: { md: "50%" } }}>
              <Grid container >
                <Grid item md={4} xs={12} p={2}>
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      p: 3,
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "5px" }}>
                      ICON
                    </Typography>
                    <DropzoneInput
                      setSelectedFile={setSelectedFileIcon}
                      previewIcon={icon}
                    />
                  </Container>
                </Grid>
                <Grid item md={8} xs={12} p={2} >
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 3,
                    }}
                  >
                    <Grid container height={"100%"}>
                      <Grid
                        item
                        display={"flex"}
                        alignItems={"center"}
                        md={12}
                        sx={{ width: "100%", height: { md: "50%" } }}
                      >
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <Container
                              sx={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                p: 3,
                              }}
                            >
                              <Typography
                                sx={{ position: "absolute", top: "5px" }}
                              >
                                OPENING
                              </Typography>
                              <TimePickerComponent
                                value={opening}
                                setValue={setOpening}
                              />
                            </Container>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Container
                              sx={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                p: 3,
                              }}
                            >
                              <Typography
                                sx={{ position: "absolute", top: "5px" }}
                              >
                                CLOSING
                              </Typography>
                              <TimePickerComponent
                                value={closing}
                                setValue={setClosing}
                              />
                            </Container>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        display={"flex"}
                        alignItems={"center"}
                        md={12}
                        sx={{ width: "100%", height: { md: "50%" } }}
                      >
                        <Container
                          sx={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 3,
                          }}
                        >
                          <Typography sx={{ position: "absolute", top: "5px" }}>
                            CUSTOM NOTE
                          </Typography>
                          <InputText
                            type="text"
                            placeholder="Custom Note"
                            name="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </Container>
                      </Grid>
                    </Grid>
                  </Container>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </ClubeLayout>
  );
};

export default ClubeProfile;
