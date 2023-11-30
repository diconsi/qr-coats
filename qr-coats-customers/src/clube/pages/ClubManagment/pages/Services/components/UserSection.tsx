import profileIcon from "@/assets/profile.png";
import {
  CustomButton,
  InputText,
  ModalComponent,
  TakePhotoEditor,
} from "@/clube/components";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  addService,
  deleteServiceById,
  resetServicesOrder,
} from "@/store/club/clubSlice";
import { stateValidator } from "@/tools";
import CameraIcon from "@mui/icons-material/CameraAltOutlined";
import DeleteIcon from "@mui/icons-material/HighlightOffOutlined";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { ChangeEvent, useEffect, useState } from "react";
import { IService } from "./TotalsSection";

interface IUserState {
  name: string;
  email: string;
  [key: string]: string;
}

const initialState: IUserState = {
  name: "",
  email: "",
};

interface ValidationRules {
  [key: string]: (value: string) => boolean;
}

interface IOrder {
  id: string;
  name: string;
}

const validationRules: ValidationRules = {
  name: (value: string) => typeof value === "string" && value !== "",
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof value === "string" && value !== "" && emailRegex.test(value);
  },
};

const UserSection = () => {
  const { qrList, services } = useAppSelector((store) => store.clubState);
  const dispatch = useAppDispatch();

  const [userState, setUserState] = useState<IUserState>(initialState);
  const [modal, setModal] = useState<boolean>(false);
  const [modalCamera, setModalCamera] = useState<boolean>(false);
  const [orderSummary, setOrderSummary] = useState<IService[]>([]);
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [order, setOrder] = useState<IOrder[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aux, setAux] = useState<IService[]>([]);

  useEffect(() => {
    dispatch(resetServicesOrder());
  }, []);

  useEffect(() => {
    updateOrderSummary();
  }, [services, qrList]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    clearErrorAndMessage(name);
    setUserState({
      ...userState,
      [name]: value,
    });
  };

  const clearErrorAndMessage = (name: string) => {
    if (errors[name] !== "") {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const updateOrderSummary = () => {
    const deepCopy = services.map((service: IService) => ({ ...service }));
    const updateOrderSummary = deepCopy.map((service) => {
      const allServices = qrList.map((item) => item.services).flat();
      const filterService = allServices.filter(
        (_service) => _service.id === service.id
      );
      if (filterService.length) {
        return { ...service, total: service.total - filterService.length };
      } else {
        return service;
      }
    });
    setAux(updateOrderSummary);
    setOrderSummary(updateOrderSummary);
  };

  const onAddUser = () => {
    setModal(true);
  };

  const clearInputs = () => {
    setUserState(initialState);
    setErrors({});
    setImgURL(null);
  };

  const onCloseModal = () => {
    setModal(false);
    clearInputs();
    setAux(orderSummary);
  };

  const onSave = () => {
    const newErrors = stateValidator(userState, validationRules);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      const newOrder = {
        name: userState.name,
        email: userState.email,
        services: order,
        img: imgURL,
      };
      dispatch(addService(newOrder));
      setModal(false);
      setUserState(initialState);
      setImgURL(null);
      setOrder([]);
    }
  };

  const onPhotoCapture = (img: string | null) => {
    setImgURL(img);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const id = name;
    const updateNewSummary = aux.map((service) => {
      if (service.id === id) {
        return checked
          ? { ...service, total: (service.total -= 1) }
          : { ...service, total: (service.total += 1) };
      } else {
        return service;
      }
    });

    setAux(updateNewSummary);

    const findService = orderSummary.find((service) => service.id === id);
    if (checked) {
      if (findService) {
        const service = {
          id: findService.id,
          name: findService.name,
        };
        setOrder([...order, service]);
      }
    } else {
      const filterService = order.filter((o) => o.id !== id);
      setOrder(filterService);
    }
  };

  const renderBody = () => {
    return (
      <Grid container display={"flex"} justifyContent={"center"}>
        <Grid item md={6} xs={12} sx={{ mb: 2 }}>
          <InputText
            type="text"
            placeholder="Username"
            name="name"
            value={userState.name}
            onChange={onChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
          display={"flex"}
          justifyContent={"center"}
          sx={{ position: "relative" }}
          mb={2}
        >
          <Avatar
            src={imgURL || ""}
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
              left: { md: "58%", xs: "62%" },
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => setModalCamera(true)}
          >
            <CameraIcon
              sx={{
                background: "#2C2D38",
                borderRadius: "50%",
                p: 1,
              }}
              fontSize="large"
              color="info"
            />
          </IconButton>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          ASSIGN AN ITEM
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <FormGroup>
              {aux
                .filter((service: IService) => service.total > 0)
                .map((service: IService) => (
                  <div key={service.id}>
                    <FormControlLabel
                      control={
                        <div>
                          <Checkbox
                            sx={{ color: "white" }}
                            name={service.id.toString()}
                            onChange={handleCheckboxChange}
                          />
                        </div>
                      }
                      label={`${service.total} - ${service.name} `}
                    />
                  </div>
                ))}
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={6} mt={2} mb={2}>
            <InputText
              placeholder="Email"
              name="email"
              type="email"
              value={userState.email}
              onChange={onChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <span
            style={{
              fontSize: "10px",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            YOUR EMAIL AND YOUR PHOTO ALLOW YOU TO RETRIEVE YOUR COAT IN CASE
            YOUR PHONE DIES.
          </span>
          <span
            style={{
              fontSize: "10px",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            IF YOU CHOOSE NOT TO UPLOAD A SELFIE, YOU WILL BE ASKED TO GIVE A
            DESCRIPTION OF YOUR COAT WHEN RETRIEVING IT WITHOUT A QR CODE.
          </span>
          <TakePhotoEditor
            titleModal={"Camera"}
            takePhotoText={"Capture"}
            saveText={"Save"}
            visible={modalCamera}
            loadingText={"Loading...."}
            imagePreview={imgURL}
            onSavedPhoto={(h) => onPhotoCapture(h)}
            onClosedModal={() => setModalCamera(false)}
          />
        </Grid>
      </Grid>
    );
  };

  const renderFooter = () => {
    return (
      <Grid container justifyContent={"end"}>
        <CustomButton fullWidth={false} label="CANCEL" onClick={onCloseModal} />
        <CustomButton
          style={{ marginLeft: "5px" }}
          fullWidth={false}
          label="SAVE"
          onClick={onSave}
          background="linear-gradient(to bottom, #A482F2, #8CABF0)"
        />
      </Grid>
    );
  };

  const userButtonEnabled = aux.every(
    (service: IService) => service.total === 0
  );

  const onDeleteService = (email: string) => {
    dispatch(deleteServiceById(email));
  };

  return (
    <Grid container justifyContent="center" pt={1} pb={1}>
      {!userButtonEnabled && (
        <Grid item display="flex" alignItems="center">
          <CustomButton
            className={"clube-button"}
            label={"Generate QR"}
            onClick={onAddUser}
          />
        </Grid>
      )}
      <Grid container>
        {qrList.map((service, index: number) => {
          return (
            <Grid
              item
              md={4}
              xs={12}
              display="flex"
              justifyContent="center"
              key={index}
              sx={{ mt: 2 }}
              width={"80%"}
            >
              <Grid
                container
                sx={{
                  backgroundColor: "#9393AB",
                  borderRadius: "30px",
                  margin: "0px 2px",
                  color: "white",
                  width: "80%",
                }}
              >
                <Grid
                  item
                  display="flex"
                  alignItems="center"
                  md={10}
                  xs={10}
                  sx={{ pl: 2 }}
                >
                  <Avatar
                    sx={{ width: 25, height: 25 }}
                    alt="user"
                    src={service.img ? service.img : profileIcon}
                  />
                  <Typography sx={{ ml: 2 }}>{service.name}</Typography>
                </Grid>
                <Grid
                  item
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  md={2}
                  xs={2}
                >
                  <IconButton
                    onClick={() => onDeleteService(service.email)}
                    aria-label="Eliminar"
                    sx={{ color: "white" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <ModalComponent
        center
        showModal={modal}
        onHide={onCloseModal}
        body={renderBody()}
        footer={renderFooter()}
      />
    </Grid>
  );
};

export default UserSection;
