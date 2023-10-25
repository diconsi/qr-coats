import profileIcon from "@/assets/profile.jpeg";
import { ModalComponent, TakePhotoEditor } from "@/clube/components";
import {
  addService,
  deleteServiceById,
  resetServicesOrder,
} from "@/store/club/clubSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const UserSection = ({ summary }) => {
  const { serviceOrder } = useSelector((store) => store.clubState);
  const [modal, setModal] = useState(false);
  const [modalCamera, setModalCamera] = useState(false);
  const [orderSummary, setOrderSummary] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [order, setOrder] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetServicesOrder());
  }, []);

  useEffect(() => {
    updateOrderSummary();
  }, [summary, serviceOrder]);

  const updateOrderSummary = () => {
    const deepCopy = summary.map((item) => ({ ...item }));
    const updateOrderSummary = deepCopy.map((s) => {
      const allServices = serviceOrder.map((item) => item.services).flat();
      const filterService = allServices.filter((i) => i.id === s.id);
      if (filterService.length) {
        return { ...s, total: s.total - filterService.length };
      } else {
        return s;
      }
    });
    setAux(updateOrderSummary);
    setOrderSummary(updateOrderSummary);
  };

  const onAddUser = () => {
    setModal(true);
  };

  const clearInputs = () => {
    setEmail("");
    setName("");
    setImgURL(null);
  };

  const onCloseModal = () => {
    setModal(false);
    clearInputs();
    setAux(orderSummary);
  };

  const onSave = () => {
    const id = uuidv4();
    const newOrder = {
      id: id,
      name: name,
      email: email,
      services: order,
      img: imgURL,
    };
    dispatch(addService(newOrder));
    setModal(false);
    setEmail("");
    setName("");
    setImgURL(null);
    setOrder([]);
  };

  const onPhotoCapture = (img) => {
    setImgURL(img);
  };

  const [aux, setAux] = useState([]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const id = name;
    const updateNewSummary = aux.map((n) => {
      if (n.id === id) {
        return checked
          ? { ...n, total: (n.total -= 1) }
          : { ...n, total: (n.total += 1) };
      } else {
        return n;
      }
    });

    setAux(updateNewSummary);

    const findService = orderSummary.find((s) => s.id === id);

    if (checked) {
      const service = { id: findService.id, name: findService.name };
      setOrder([...order, service]);
    } else {
      const filterService = order.filter((o) => o.id !== id);
      setOrder(filterService);
    }
  };

  const renderBody = () => {
    return (
      <Grid container>
        <TextField
          style={{ width: "100%" }}
          id="filled-basic"
          label="User"
          variant="filled"
          name="Name"
          color="primary"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="image-container-profile">
          <img
            src={imgURL ? imgURL : profileIcon}
            width={250}
            height={150}
            alt="Imagen redonda"
          />
        </div>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Button
            variant="contained"
            style={{ width: "50%" }}
            onClick={() => setModalCamera(true)}
          >
            Add Selfie
          </Button>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <FormGroup>
              {aux
                .filter((s) => s.total > 0)
                .map((s) => (
                  <div key={s.id}>
                    <FormControlLabel
                      control={
                        <div>
                          <Checkbox
                            name={s.id.toString()}
                            onChange={handleCheckboxChange}
                          />
                        </div>
                      }
                      label={`${s.total} - ${s.name} `}
                    />
                  </div>
                ))}
            </FormGroup>
          </Grid>
          <TextField
            style={{ width: "100%" }}
            id="filled-password-input"
            label="Email"
            type="email"
            autoComplete="current-password"
            variant="filled"
            color="primary"
            name="secret"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
      <Grid container spacing={2} flexDirection="row" justifyContent="end">
        <Button onClick={onCloseModal} variant="contained">
          Cancelar
        </Button>
        <Button sx={{ ml: 2 }} onClick={onSave} variant="contained">
          Guardar
        </Button>
      </Grid>
    );
  };

  const userButtonEnabled = aux.every((item) => item.total === 0);

  const onDeleteService = (idService) => {
    dispatch(deleteServiceById(idService));
  };

  return (
    <Grid justifyContent="center" container style={{ height: "100%" }}>
      <Grid item display="flex" alignItems="center" style={{ height: "45%" }}>
        <Button
          onClick={onAddUser}
          disabled={userButtonEnabled}
          variant="contained"
        >
          Add User
        </Button>
      </Grid>
      <Grid container style={{ height: "55%", overflowY: "scroll" }}>
        {serviceOrder.map((service) => {
          return (
            <Grid
              item
              md={4}
              xs={12}
              display="flex"
              justifyContent="center"
              key={service.id}
            >
              <Grid
                container
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: "5px",
                  margin: "0px 2px",
                  color: "white",
                }}
              >
                <Grid
                  item
                  display="flex"
                  alignItems="center"
                  md={10}
                  xs={8}
                  sx={{ pl: 2 }}
                >
                  <Avatar
                    alt="user"
                    src={service.img ? service.img : profileIcon}
                  />
                  <Typography sx={{ ml: 2 }}>{service.name}</Typography>
                </Grid>
                <Grid
                  item
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  md={2}
                  xs={4}
                >
                  <IconButton aria-label="Editar" sx={{ color: "white" }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDeleteService(service.id)}
                    aria-label="Eliminar"
                    sx={{ color: "red" }}
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
