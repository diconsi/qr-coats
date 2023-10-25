import { TakePhotoEditor } from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { uploadFile } from "@/firebase/config";
import { startUpdateProfile } from "@/store/auth";
import { Avatar, Button, Container, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const fileClon = (file, name, type) => {
  return new File([file], name, { type: type || file.type });
};

const UserData = () => {
  const { email, name, lastName, nationality, birthDate, phone, id, photoURL } =
    useSelector((store) => store.authState);

  const dispatch = useDispatch();
  useEffect(() => {
    setEmailUser(email);
    setNameUser(name);
    setLastNameUser(lastName);
    setBirthDateUser(birthDate);
    setNationalityUser(nationality);
    setPhoneUser(phone);
    setImgURL(photoURL);
  }, []);

  const [showCamera, setShowCamera] = useState(false);
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [nameUser, setNameUser] = useState("");
  const [lastNameUser, setLastNameUser] = useState("");
  const [birthDateUser, setBirthDateUser] = useState("");
  const [nationalityUser, setNationalityUser] = useState("");
  const [phoneUser, setPhoneUser] = useState("");
  const [emailUser, setEmailUser] = useState("");

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const onPhotoCapture = (img) => {
    setImgURL(img);
  };

  const updateProfile = async () => {
    const response = await fetch(imgURL);
    const blob = await response.blob();
    const file = fileClon(blob, "ejemplo", "image/jpeg");
    const url = await uploadFile(file, "customers");
    const profile = {
      id: id,
      name: nameUser,
      lastName: lastNameUser,
      birthDate: birthDateUser,
      nationality: nationalityUser,
      phone: phoneUser,
      email: emailUser,
      photo: url,
    };
    dispatch(startUpdateProfile(profile));
  };
  return (
    <ClubeLayout>
      <Container>
        <Grid container display="flex" justifyContent="center" spacing={3}>
          <Grid item md={12} xs={12} display="flex" justifyContent="center">
            <Avatar src={imgURL} sx={{ width: 200, height: 200 }} />
          </Grid>
          <Grid display="flex" justifyContent="center" item xs={12} md={12}>
            <Button onClick={handleOpenCamera} variant="contained">
              Add Selfie
            </Button>
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              label="First Name"
              placeholder="First Name"
              value={nameUser}
              onChange={(e) => setNameUser(e.target.value)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              label="Last Name"
              placeholder="Last Name"
              value={lastNameUser}
              onChange={(e) => setLastNameUser(e.target.value)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              label="Birthdate"
              placeholder="Birthdate"
              value={birthDateUser}
              onChange={(e) => setBirthDateUser(e.target.value)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              label="Nationality"
              placeholder="Nationality"
              value={nationalityUser}
              onChange={(e) => setNationalityUser(e.target.value)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              label="Phone"
              placeholder="Phone"
              type="number"
              value={phoneUser}
              onChange={(e) => setPhoneUser(e.target.value)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Email"
              type="email"
              value={emailUser}
              onChange={(e) => setEmailUser(e.target.value)}
            />
          </Grid>
          <Grid item md={12}>
            <Button variant="contained" onClick={updateProfile}>
              Update Profile
            </Button>
          </Grid>
        </Grid>
        <TakePhotoEditor
          titleModal={"Camera"}
          takePhotoText={"Capture"}
          saveText={"Save"}
          visible={showCamera}
          loadingText={"Loading...."}
          imagePreview={imgURL}
          onSavedPhoto={(h) => onPhotoCapture(h)}
          onClosedModal={() => setShowCamera(false)}
        />
      </Container>
    </ClubeLayout>
  );
};

export default UserData;
