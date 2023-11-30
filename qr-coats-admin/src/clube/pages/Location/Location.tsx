import { ModalComponent, TableList } from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import {
  deleteLocation,
  editLocation,
  newLocation,
} from "@/constants/locations";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import {
  createLocation,
  eliminaLocation,
  getLocations,
} from "@/services/location.services";
import {
  addLocation,
  deleteLocationById,
  setLocations,
  updateLocation,
} from "@/store/location/locationSlice";
import { ActionIcon, Group } from "@mantine/core";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const initialState = {
  locationType: "",
  name: "",
  numberOfHangers: 0,
  numberSlots: 0,
};
const Location = () => {
  const { locations } = useSelector((store) => store.locationState);
  const { access_token } = useSelector((store) => store.authState);
  const {
    activeClub: { slotsActive, numberLocations, name: clubName, _id },
  } = useSelector((store) => store.clubState);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const { data } = await callEndpoint(getLocations(_id, access_token));
    dispatch(setLocations(data));
  };

  const { callEndpoint } = useFetchAndLoad();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [state, setState] = useState(initialState);
  const [activeLocation, setActiveLocation] = useState({});
  const disableButton =
    locations.length !== 0 ? locations.length < numberLocations : false;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newValue =
      name === "numberSlots" || name === "numberOfHangers"
        ? parseInt(value)
        : value;
    setState({
      ...state,
      [name]: newValue,
    });
  };

  const handleActioModal = (titleModal: string, location: any) => {
    if (location !== undefined) setActiveLocation(location);
    if (titleModal === editLocation) {
      const { locationType, name, numberOfHangers, numberSlots } = location;
      setState({ ...state, locationType, name, numberOfHangers, numberSlots });
    }
    setTitleModal(titleModal);
    setShowModal(true);
  };

  const onClosedModal = () => {
    setShowModal(false);
    setState(initialState);
    setActiveLocation({});
  };
  const columns = [
    { accessor: "name", title: "Location", textAlignment: "center" },
    { accessor: "locationType", title: "Type", textAlignment: "center" },
    { accessor: "numberSlots", title: "Number Slots", textAlignment: "center" },
    {
      accessor: "numberOfHangers",
      title: "Number Hangers",
      textAlignment: "center",
    },
    {
      accessor: "acciones",
      title: "Acciones",
      textAlignment: "center",
      render: (row) => renderOpcion(row),
    },
  ];

  const renderOpcion = (row) => {
    return (
      <Group spacing={4} position="center" noWrap>
        <ActionIcon
          color="blue"
          onClick={() => handleActioModal(editLocation, row)}
        >
          <EditOutlined />
        </ActionIcon>
        <ActionIcon
          color="red"
          onClick={() => handleActioModal(deleteLocation, row)}
        >
          <DeleteOutline />
        </ActionIcon>
      </Group>
    );
  };

  const onSaveLocation = async () => {
    const newLocation = {
      locationType: state.locationType,
      name: state.name,
      numberOfHangers: state.numberOfHangers,
      numberSlots: state.numberSlots,
      status: true,
      clubId: _id,
    };
    const { status, data } = await callEndpoint(
      createLocation(access_token, newLocation)
    );
    if (status === 201) {
      setState(initialState);
      dispatch(addLocation(data));
      onClosedModal();
    }
  };

  const onDeletedLocation = async () => {
    const resp = await callEndpoint(
      eliminaLocation(activeLocation._id, { status: false }, access_token)
    );

    const {
      status,
      data: { _id },
    } = resp;
    if (status === 200) {
      setActiveLocation({});
      dispatch(deleteLocationById(_id));
      onClosedModal();
    }
  };

  const onEditLocation = async () => {
    // const location = {
    //   name: state.name,
    //   username: state.username,
    //   email: state.email,
    //   gender: state.gender,
    // };
    // const { status, data } = await callEndpoint(
    //   updateUser(activeUser._id, employee, access_token)
    // );
    // if (status === 200) {
    //   setActiveLocation({});
    //   dispatch(updateLocation(data));
    //   onClosedModal();
    // }
  };

  const onSave = () => {
    if (titleModal === newLocation) {
      onSaveLocation();
    } else if (titleModal === deleteLocation) {
      onDeletedLocation();
    } else if (titleModal === editLocation) {
      onEditLocation();
    }
  };

  const renderBody = () => {
    return (
      <>
        {titleModal === deleteLocation ? (
          <Grid item sx={{ width: "100%" }}>
            Realmente quiere eliminar <strong>el location!</strong>
          </Grid>
        ) : (
          <Grid container>
            <Grid item mt={1} md={12}>
              <TextField
                fullWidth
                type="text"
                label="Name"
                placeholder="Name Location"
                value={state.name}
                id="name"
                name="name"
                onChange={onChange}
              />
            </Grid>
            <Grid item mt={1} md={12} sx={{ pr: 0.5 }}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={state.locationType}
                  onChange={onChange}
                  id="locationType"
                  name="locationType"
                  label="Type"
                >
                  <MenuItem value="">
                    <em>Seleccionar</em>
                  </MenuItem>
                  <MenuItem value="Item Cheker">Item Cheker</MenuItem>
                  <MenuItem value="Entry">Entry</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {state.locationType !== "Entry" && (
              <>
                <Grid item mt={1} md={6}>
                  <TextField
                    fullWidth
                    label="Hangers"
                    type="number"
                    placeholder="Hangers"
                    id="numberOfHangers"
                    name="numberOfHangers"
                    value={state.numberOfHangers}
                    onChange={onChange}
                    inputProps={{
                      min: 0,
                      step: 1,
                    }}
                    variant="outlined"
                    sx={{ pr: 0.5 }}
                  />
                </Grid>
                <Grid item mt={1} md={6}>
                  <TextField
                    fullWidth
                    sx={{ pl: 0.5 }}
                    label="Slots"
                    type="number"
                    placeholder="Slots"
                    id="numberSlots"
                    name="numberSlots"
                    value={state.numberSlots}
                    disabled={!slotsActive}
                    onChange={onChange}
                    inputProps={{
                      min: 0,
                      step: 1,
                    }}
                    variant="outlined"
                  />
                </Grid>
              </>
            )}
          </Grid>
        )}
      </>
    );
  };

  return (
    <ClubeLayout>
      <Container sx={{ height: "80%", maxWidth: "100% !important" }}>
        <TableList
          title={newLocation}
          titleButton={newLocation}
          iconHeaderSection={<MapOutlinedIcon />}
          data={locations}
          disableButton={disableButton}
          columns={columns}
          handleActioModal={handleActioModal}
        />
        <ModalComponent
          title={titleModal}
          center
          body={renderBody()}
          showModal={showModal}
          onClose={onClosedModal}
          onSave={onSave}
        />
      </Container>
    </ClubeLayout>
  );
};

export default Location;
