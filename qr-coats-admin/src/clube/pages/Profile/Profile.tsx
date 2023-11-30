import {
  ContainerBorder,
  DropzoneInput,
  HeaderSectionPage,
  TimePickerComponent,
} from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { uploadFiles } from "@/firebase/config";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import { updateClube } from "@/services";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import { Container, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useSelector } from "react-redux";

const ClubeProfile = () => {
  const { activeClub } = useSelector((store) => store.clubState);
  const { uid, access_token } = useSelector((store) => store.authState);
  const {
    name,
    icon,
    photo,
    customNote,
    closingHour,
    openingHour,
    iconQrVisble,
  } = activeClub;
  const [note, setNote] = useState(customNote);
  const [closing, setClosing] = useState(closingHour);
  const [opening, setOpening] = useState(openingHour);

  const [selectedFileIcon, setSelectedFileIcon] = useState(null);
  const [selectedFilePhoto, setSelectedFilePhoto] = useState(null);

  const { callEndpoint } = useFetchAndLoad();

  const handleUpdate = async () => {
    let iconClub = null;
    let photoClub = null;

    if (selectedFileIcon) {
      iconClub = await uploadFiles(selectedFileIcon, "logos");
    }

    if (selectedFilePhoto) {
      photoClub = await uploadFiles(selectedFilePhoto, "clubes");
    }

    const newClub = {
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
      alert("Acualizado correctamente");
      setSelectedFileIcon(null);
      setSelectedFilePhoto(null);
    }
  };

  return (
    <ClubeLayout>
      <Container sx={{ height: "100%", maxWidth: "100% !important" }}>
        <HeaderSectionPage
          title={`${name} - Settings`}
          titleButton="Update"
          onClick={handleUpdate}
          icon={<UpdateOutlinedIcon />}
        />
        <Grid container sx={{ height: "80%", width: "100%" }}>
          <Grid
            container
            sx={{
              height: "35%",
              padding: "20px 0px",
              justifyContent: "space-between",
            }}
          >
            <ContainerBorder title="Icon" height="100%" width="49%">
              <DropzoneInput
                setSelectedFile={setSelectedFileIcon}
                previewIcon={icon}
              />
            </ContainerBorder>
            <ContainerBorder title="Image" height="100%" width="49%">
              <DropzoneInput
                setSelectedFile={setSelectedFilePhoto}
                previewIcon={photo}
              />
            </ContainerBorder>
          </Grid>
          <Grid
            container
            sx={{
              height: "35%",
              padding: "20px 0px",
              justifyContent: "space-between",
            }}
          >
            <ContainerBorder title="QR Clube" height="100%" width="49%">
              <Grid display="flex" justifyContent="center" width="50%">
                <QRCode
                  logoImage={icon }
                  logoHeight={35}
                  logoWidth={35}
                  logoPadding={1}
                  value={`https://www.employes.com/?idAdmin=${uid}&idClub=${activeClub.id}`}
                />
              </Grid>
            </ContainerBorder>
            <ContainerBorder title="QR Customer" height="100%" width="49%">
              <Grid display="flex" justifyContent="center" width="50%">
                <QRCode
                  logoImage={iconQrVisble ? (icon ? icon : null) : null}
                  logoHeight={35}
                  logoWidth={35}
                  logoPadding={1}
                  value={`https://192.168.100.55:5173/?idClub=${activeClub.id}`}
                />
              </Grid>
            </ContainerBorder>
          </Grid>
          <Grid
            container
            sx={{
              height: "30%",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <ContainerBorder title="Club Hours" height="100%" width="49%">
              <Grid>
                <TimePickerComponent
                  value={opening}
                  setValue={setOpening}
                  placeHolder="Opening"
                />
                <TimePickerComponent
                  value={closing}
                  setValue={setClosing}
                  placeHolder="Closing"
                />
              </Grid>
            </ContainerBorder>
            <ContainerBorder title="Note" width="49%" height="100%">
              <TextField
                sx={{ width: "50%" }}
                label="Custom Note"
                type="text"
                placeholder="Note"
                fullWidth
                variant="filled"
                color="primary"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </ContainerBorder>
          </Grid>
        </Grid>
      </Container>
    </ClubeLayout>
  );
};

export default ClubeProfile;
