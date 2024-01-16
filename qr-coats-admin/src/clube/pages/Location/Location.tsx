import {
  CustomButton,
  HeaderSectionPage,
  InputText,
  ModalComponent,
  TableList,
} from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import {
  deleteLocation,
  editLocation,
  location,
  newLocation,
} from "@/constants/locations";
import { useAppSelector } from "@/hooks";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import {
  createLocation,
  eliminaLocation,
  getLocations,
  updatedLocation,
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
  Alert,
  ButtonGroup,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
interface ILocation {
  clubId: string;
  locationType: string;
  name: string;
  numberOfHangers: number;
  numberSlots: number;
  status: boolean;
  _id: string;
}

const initialState = {
  locationType: "",
  name: "",
  numberOfHangers: 0,
  numberSlots: 0,
};
const Location = () => {
  const { locations } = useAppSelector((store) => store.locationState);
  const { access_token } = useAppSelector((store) => store.authState);
  const {
    activeClub: { slotsActive, numberLocations, _id },
  } = useAppSelector((store) => store.clubState);

  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const resp = await callEndpoint(getLocations(_id, access_token));
    const data = resp.data as unknown as [ILocation];
    dispatch(setLocations(data.filter((element) => element.status !== false)));
  };

  const { callEndpoint } = useFetchAndLoad();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [state, setState] = useState(initialState);
  const [activeLocation, setActiveLocation] = useState("");
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

  const onChangeHangers = (name: string, value: number) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const onChangeSelect = (event: SelectChangeEvent<string>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleActioModal = (
    titleModal: string,
    _id: string = "",
    locationType: string = "",
    name: string = "",
    numberOfHangers: number = 0,
    numberSlots: number = 0
  ) => {
    if (location !== undefined) setActiveLocation(_id);
    if (titleModal === editLocation) {
      setState({ ...state, locationType, name, numberOfHangers, numberSlots });
    }
    setTitleModal(titleModal);
    setShowModal(true);
  };

  const onClosedModal = () => {
    setShowModal(false);
    setState(initialState);
    setActiveLocation("");
    setAlertMessage("");
  };
  const columns = [
    { accessor: "name", title: "LOCATION", textAlignment: "center" },
    { accessor: "locationType", title: "TYPE", textAlignment: "center" },
    { accessor: "numberSlots", title: "NUMBER SLOTS", textAlignment: "center" },
    {
      accessor: "numberOfHangers",
      title: "NUMBER HANGERS",
      textAlignment: "center",
    },
    {
      accessor: "acciones",
      title: "ACTIONS",
      textAlignment: "center",
      render: ({
        locationType,
        name,
        numberOfHangers,
        numberSlots,
        _id,
      }: {
        locationType: string;
        name: string;
        numberOfHangers: number;
        numberSlots: number;
        _id: string;
      }) => renderOpcion(locationType, name, numberOfHangers, numberSlots, _id),
    },
  ];

  const renderOpcion = (
    locationType: string,
    name: string,
    numberOfHangers: number,
    numberSlots: number,
    _id: string
  ) => {
    return (
      <Group spacing={4} position="center" noWrap>
        <ActionIcon
          color="blue"
          onClick={() =>
            handleActioModal(
              editLocation,
              _id,
              locationType,
              name,
              numberOfHangers,
              numberSlots
            )
          }
        >
          <EditOutlined />
        </ActionIcon>
        <ActionIcon
          color="red"
          onClick={() => handleActioModal(deleteLocation, _id)}
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
    const { status, data } = await callEndpoint(
      eliminaLocation(activeLocation, access_token, { status: false })
    );
    const { _id } = data as { _id: string };
    if (status === 200) {
      setActiveLocation("");
      dispatch(deleteLocationById(_id));
      onClosedModal();
    }
  };

  const [alertMessage, setAlertMessage] = useState("");

  const onEditLocation = async () => {
    try {
      const { data } = await callEndpoint(
        updatedLocation(activeLocation, state, access_token)
      );
      setActiveLocation("");
      dispatch(updateLocation(data));
      onClosedModal();
    } catch (error: any) {
      setAlertMessage(error.response.data.error.message);
    }
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

  const renderAlert = () => {
    const message =
      titleModal === deleteLocation
        ? "You really want to remove the location!"
        : alertMessage;
    return (
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
    );
  };

  const renderBody = () => {
    return (
      <>
        {titleModal === deleteLocation ? (
          renderAlert()
        ) : alertMessage === "" ? (
          <Grid container>
            <Grid item mt={1} md={12}>
              <InputText
                type="text"
                placeholder="Name Location"
                name="name"
                value={state.name}
                onChange={onChange}
              />
            </Grid>
            <Grid item mt={1} md={12} sx={{ pr: 0.5 }}>
              <FormControl sx={{ width: "100%" }}>
                <Select
                  disabled={titleModal === editLocation}
                  value={state.locationType}
                  onChange={onChangeSelect}
                  id="locationType"
                  name="locationType"
                  label="Type"
                  sx={{
                    borderRadius: "30px",
                    border: "2px solid #B8BCFE",
                    "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                      {
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        color: "white",
                      },
                  }}
                >
                  <MenuItem value="">
                    <em>Seleccionar</em>
                  </MenuItem>
                  <MenuItem value="Item Cheker">Item Cheker</MenuItem>
                  <MenuItem value="Entry">Entry</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={12}>
              {state.locationType !== "Entry" && (
                <Grid container width={"100%"} height={"100%"}>
                  <Grid
                    item
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    mt={1}
                    md={6}
                  >
                    <Typography>HANGERS</Typography>
                    <ButtonGroup
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "#656581",
                        borderRadius: "30px",
                        width: "60%",
                      }}
                    >
                      <CustomButton
                        label="-"
                        onClick={() =>
                          onChangeHangers(
                            "numberOfHangers",
                            Math.max(state.numberOfHangers - 1, 0)
                          )
                        }
                        style={{
                          border: "none",
                          borderRadius: "30px",
                        }}
                      />
                      <Typography>{state.numberOfHangers}</Typography>
                      <CustomButton
                        label={"+"}
                        onClick={() =>
                          onChangeHangers(
                            "numberOfHangers",
                            state.numberOfHangers + 1
                          )
                        }
                        style={{
                          border: "none",
                          borderRadius: "30px",
                        }}
                      />
                    </ButtonGroup>
                  </Grid>
                  <Grid
                    item
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    mt={1}
                    md={6}
                  >
                    <Typography>SLOTS</Typography>
                    <ButtonGroup
                      disabled={!slotsActive}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "#656581",
                        borderRadius: "30px",
                        width: "60%",
                      }}
                    >
                      <CustomButton
                        label="-"
                        onClick={() =>
                          onChangeHangers(
                            "numberSlots",
                            Math.max(state.numberSlots - 1, 0)
                          )
                        }
                        style={{
                          border: "none",
                          borderRadius: "30px",
                        }}
                      />
                      <Typography>{state.numberSlots}</Typography>
                      <CustomButton
                        label={"+"}
                        onClick={() =>
                          onChangeHangers("numberSlots", state.numberSlots + 1)
                        }
                        style={{
                          border: "none",
                          borderRadius: "30px",
                        }}
                      />
                    </ButtonGroup>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        ) : (
          renderAlert()
        )}
      </>
    );
  };

  const renderFooter = () => {
    return (
      <Grid container justifyContent={"end"}>
        <CustomButton
          fullWidth={false}
          label="CANCEL"
          onClick={onClosedModal}
        />
        <CustomButton
          style={{ marginLeft: "5px" }}
          fullWidth={false}
          label="OK"
          onClick={onSave}
          background="linear-gradient(to bottom, #A482F2, #8CABF0)"
        />
      </Grid>
    );
  };

  const handleNewLocation = () => {
    handleActioModal(newLocation);
  };

  return (
    <ClubeLayout>
      <Grid container sx={{ height: "100%", width: "100%", p: 2 }}>
        <Grid
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          height={"10%"}
          item
          p={2}
        >
          <HeaderSectionPage
            title={location.toUpperCase()}
            titleButton={newLocation}
            onClick={handleNewLocation}
            icon={<MapOutlinedIcon />}
            disableButton={disableButton}
          />
        </Grid>
        <Grid container sx={{ height: "90%", width: "100%", p: 2 }}>
          <TableList data={locations} columns={columns} />
          <ModalComponent
            title={titleModal}
            center
            body={renderBody()}
            showModal={showModal}
            onHide={onClosedModal}
            footer={renderFooter()}
          />
        </Grid>
      </Grid>
    </ClubeLayout>
  );
};

export default Location;
