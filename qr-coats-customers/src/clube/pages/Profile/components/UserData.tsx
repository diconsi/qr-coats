import {
  HeaderSectionPage,
  InputText,
  TakePhotoEditor,
} from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { uploadFile } from "@/firebase/config";
import { useAppDispatch, useAppSelector, useFetchAndLoad } from "@/hooks";
import { updateUser } from "@/services";
import { updateProfile } from "@/store/auth/authSlice";
import { fileClon } from "@/tools";
import { CheckingAuth } from "@/ui";
import { SaveAltOutlined } from "@mui/icons-material";
import CameraIcon from "@mui/icons-material/CameraAltOutlined";
import { Avatar, Grid, IconButton } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

interface IUserData {
  uid: string;
  name: string;
  birthDate: string;
  nationality: string;
  phone: string;
  email: string;
}

const initialState: IUserData = {
  uid: "",
  name: "",
  birthDate: "",
  nationality: "",
  phone: "",
  email: "",
};

const UserData = () => {
  const {
    email,
    name,
    nationality = "",
    birthDate = "",
    phone = "",
    uid,
    photoURL = "",
    access_token,
  } = useAppSelector((store) => store.authState);
  const dispatch = useAppDispatch();
  const { callEndpoint, loading } = useFetchAndLoad();
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [userData, setUserData] = useState(initialState);
  const [imgURL, setImgURL] = useState<string>("");
  useEffect(() => {
    setImgURL(photoURL);
    setUserData({
      ...userData,
      name,
      birthDate,
      nationality,
      phone,
      email,
    });
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const [showCamera, setShowCamera] = useState(false);

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const onClosedCamera = () => {
    setShowCamera(false);
  };

  const onPhotoCapture = (img: string | null) => {
    if (img) {
      setImgURL(img);
      setUploadPhoto(true);
    }
  };

  const update = async () => {
    let url = photoURL;
    if (uploadPhoto) {
      const response = await fetch(imgURL);
      const blob = await response.blob();
      const file = fileClon(blob, uid, "image/jpeg");
      url = await uploadFile(file, "customers");
    }
    const updatedUser = { ...userData, photoURL: url };
    const { data } = await callEndpoint(
      updateUser(uid, updatedUser, access_token)
    );
    dispatch(updateProfile(data));
  };

  return (
    <ClubeLayout>
      {loading ? (
        <CheckingAuth />
      ) : (
        <Grid container bgcolor={"primary.main"} width={"100%"} height={"100%"}>
          <Grid
            container
            display="flex"
            alignItems={"center"}
            width={"100%"}
            height={"20%"}
          >
            <HeaderSectionPage
              title={"PROFILE"}
              titleButton={"Update Profile"}
              onClick={update}
              icon={<SaveAltOutlined />}
            />
          </Grid>
          <Grid
            container
            height={"80%"}
            width={"100%"}
            justifyContent={"center"}
            sx={{ mr: 2, ml: 2 }}
          >
            <Grid
              item
              md={12}
              xs={12}
              display={"flex"}
              justifyContent={"center"}
              sx={{ position: "relative" }}
            >
              <Avatar
                src={imgURL ? imgURL : photoURL}
                sx={{
                  width: 100,
                  height: 100,
                  border: "2px solid white",
                }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "80%",
                  left: { md: "58%", xs: "60%" },
                  transform: "translate(-50%, -50%)",
                }}
                onClick={handleOpenCamera}
              >
                <CameraIcon
                  sx={{
                    background: "#2C2D38",
                    borderRadius: "50%",
                    p: 1,
                    border: "2px solid white",
                  }}
                  fontSize="large"
                  color="info"
                />
              </IconButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputText
                type="text"
                label="FULL NAME"
                placeholder="ENTER FULL NAME"
                name="name"
                value={userData.name}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputText
                type="text"
                label="BIRTHDATE"
                placeholder="ENTER BIRTHDATE"
                name="birthDate"
                value={userData.birthDate}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputText
                type="text"
                label="NATIONALITY"
                placeholder="ENTER NATIONALITY"
                name="nationality"
                value={userData.nationality}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputText
                type="text"
                label="PHONE"
                placeholder="ENTER PHONE"
                name="phone"
                value={userData.phone}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputText
                type="text"
                label="EMAIL"
                placeholder="ENTER EMAIL"
                name="email"
                value={userData.email}
                onChange={onChange}
              />
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
            onClosedModal={onClosedCamera}
          />
        </Grid>
      )}
    </ClubeLayout>
  );
};

export default UserData;
