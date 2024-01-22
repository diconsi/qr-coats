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
import AddIcon from "@mui/icons-material/AddCircleOutlined";
import CameraIcon from "@mui/icons-material/CameraAltOutlined";
import DeleteIcon from "@mui/icons-material/HighlightOffOutlined";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutlined";
import { Avatar, Grid, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { ChangeEvent, useEffect, useState } from "react";
import { IService } from "./TotalsSection";
import { v4 } from "uuid";

interface IButton {
  id: string;
  disabled: boolean;
}
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
  const [errorCheck, setErrorCheck] = useState("");
  const [statusButton, setStatusButton] = useState<IButton[]>([]);

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
    const list = services.map((s) => ({ id: s.id, disabled: false }));
    setStatusButton(list);
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
    updateOrderSummary();
    setOrder([]);
    setErrorCheck("");
  };

  const onSave = () => {
    const newErrors = stateValidator(userState, validationRules);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      if (order.length === 0) {
        setErrorCheck("Choose an item");
      } else {
        setErrors({});
        const newOrder = {
          id: v4(),
          name: userState.name,
          email: userState.email,
          services: order,
          photo: imgURL,
        };
        dispatch(addService(newOrder));
        setModal(false);
        setUserState(initialState);
        setImgURL(null);
        setOrder([]);
      }
    }
  };

  const onPhotoCapture = (img: string | null) => {
    setImgURL(img);
  };

  const deleteItem = (id: string) => {
    const updatedButtons = statusButton.map((element: IButton) => {
      if (element.id === id) {
        return { ...element, disabled: false };
      } else {
        return element;
      }
    });

    setStatusButton(updatedButtons);

    const filterOrder = order.filter((o) => o.id !== id);
    setOrder(filterOrder);
    const updateNewSummary = aux.map((service) => {
      if (service.id === id) {
        return { ...service, total: (service.total += 1) };
      } else {
        return service;
      }
    });
    setAux(updateNewSummary);
  };

  const addItem = (id: string) => {
    const updatedButtons = statusButton.map((element: IButton) => {
      if (element.id === id) {
        return { ...element, disabled: true };
      } else {
        return element;
      }
    });

    setStatusButton(updatedButtons);
    const updateNewSummary = aux.map((service) => {
      if (service.id === id) {
        return { ...service, total: (service.total -= 1) };
      } else {
        return service;
      }
    });

    setAux(updateNewSummary);
    const findService = orderSummary.find((service) => service.id === id);
    if (findService) {
      const service = {
        id: findService.id,
        name: findService.name,
      };
      setOrder([...order, service]);
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
            <Grid container>
              <Grid
                item
                display="flex"
                justifyContent={"center"}
                alignItems={"center"}
                xs={4}
              >
                Item
              </Grid>
              <Grid
                item
                display="flex"
                justifyContent={"center"}
                alignItems={"center"}
                xs={4}
              >
                Available
              </Grid>
              <Grid
                item
                display="flex"
                justifyContent={"center"}
                alignItems={"center"}
                xs={4}
              >
                Assigned
              </Grid>
            </Grid>
            {aux.map((service: IService) => {
              const findButton = statusButton.find(
                (button: IButton) => button.id === service.id
              );
              return (
                <Grid container key={service.id}>
                  <Grid
                    item
                    display="flex"
                    justifyContent={"center"}
                    alignItems={"center"}
                    xs={4}
                  >
                    {service.name}
                  </Grid>
                  <Grid
                    item
                    display="flex"
                    justifyContent={"center"}
                    alignItems={"center"}
                    xs={4}
                  >
                    {service.total}
                    <IconButton
                      aria-label="Eliminar"
                      sx={{ color: "white" }}
                      onClick={() => addItem(service.id)}
                      disabled={service.total <= 0 || findButton?.disabled}
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  <Grid
                    item
                    display="flex"
                    justifyContent={"center"}
                    alignItems={"center"}
                    xs={4}
                  >
                    {!findButton?.disabled ? 0 : 1}
                    <IconButton
                      aria-label="Eliminar"
                      sx={{ color: "white" }}
                      onClick={() => deleteItem(service.id)}
                      disabled={!findButton?.disabled}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <span style={{ color: "#ff1744", fontSize: "0.75rem" }}>
            {errorCheck}
          </span>
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

  const onDeleteService = (id: string) => {
    dispatch(deleteServiceById(id));
  };

  return (
    <Grid container justifyContent="center" pt={1} pb={1}>
      {!userButtonEnabled && (
        <Grid item display="flex" alignItems="center">
          <CustomButton
            className={"clube-button"}
            label={"Generate Codes"}
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
                    src={service.photo ? service.photo : profileIcon}
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
                    onClick={() => onDeleteService(service.id)}
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
        title="Generate Your QR Code(s)"
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
