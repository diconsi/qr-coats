import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Col, Container, Image, Row } from "react-bootstrap";
import { CustomButton, ModalComponent } from "..";
import {  Grid } from "@mui/material";

interface ITake {
  visible: boolean;
  onClosedModal: () => void;
  titleModal: string;
  takePhotoText: string;
  saveText: string;
  loadingText: string;
  onSavedPhoto: (imagePreview: string | null) => void;
  imagePreview: string | null;
}

const TakePhotoEditor = ({
  visible,
  onClosedModal,
  titleModal,
  takePhotoText,
  saveText,
  onSavedPhoto,
  imagePreview,
}: ITake) => {
  const webCamRef = useRef<Webcam>(null);
  const [type, setType] = useState("NEW");
  const [loadingButtonSave, setLoadingButtonSave] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (imagePreview) {
      setFilePreview(imagePreview);
      setType("EDIT");
    }
  }, [imagePreview]);

  const onPressTakePhoto = () => {
    if (type === "NEW") {
      let imageSrc = null;
      imageSrc = webCamRef.current?.getScreenshot() ?? null;
      setFilePreview(imageSrc);
      setType("EDIT");
    } else {
      onSavedPhoto(filePreview);
      onCloseCamera();
    }
  };

  const onCloseCamera = () => {
    setFilePreview(null);
    onClosedModal();
    setType("NEW");
    setLoadingButtonSave(false);
  };

  const renderWebCam = () => {
    return (
      <>
        <Webcam
          ref={webCamRef}
          height={350}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={{
            facingMode: "user",
          }}
        />
      </>
    );
  };

  return (
    <ModalComponent
      showModal={visible}
      center
      onClose={onCloseCamera}
      title={filePreview ? titleModal : null}
      body={
        <Container>
          <Row>
            <Col xs={12} md={12}>
              {visible && filePreview ? (
                <Image src={filePreview} alt="Captured" />
              ) : (
                renderWebCam()
              )}
            </Col>
          </Row>
        </Container>
      }
      footer={
        <Grid container justifyContent={"end"}>
          <CustomButton
            fullWidth={false}
            label="CANCEL"
            onClick={onCloseCamera}
          />
          <CustomButton
            style={{ marginLeft: "5px" }}
            fullWidth={false}
            disabled={loadingButtonSave}
            label={
              loadingButtonSave
                ? "... "
                : type === "NEW"
                ? takePhotoText
                : saveText
            }
            onClick={onPressTakePhoto}
            background="linear-gradient(to bottom, #A482F2, #8CABF0)"
          />
        </Grid>
      }
    />
  );
};

export default TakePhotoEditor;
