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
} from "@/services/location.services";
import {
  addLocation,
  deleteLocationById,
  setLocations,
} from "@/store/location/locationSlice";
import { ActionIcon, Group } from "@mantine/core";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
    const { data } = await callEndpoint(getLocations(_id, access_token));
    dispatch(setLocations(data));
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

  const onChangeSelect = (event: SelectChangeEvent<string>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleActioModal = (
    titleModal: string,
    locationType: string = "",
    name: string = "",
    numberOfHangers: number = 0,
    numberSlots: number = 0,
    _id: string = ""
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

              locationType,
              name,
              numberOfHangers,
              numberSlots,
              _id
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
    const resp = await callEndpoint(
      eliminaLocation(activeLocation, { status: false }, access_token)
    );

    const {
      status,
      data: { _id },
    } = resp;
    if (status === 200) {
      setActiveLocation("");
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
            You really want to remove <strong>the location!</strong>
          </Grid>
        ) : (
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
            {state.locationType !== "Entry" && (
              <>
                <Grid item mt={1} md={6}>
                  <InputText
                    placeholder="Hangers"
                    type="number"
                    name="numberOfHangers"
                    value={state.numberOfHangers}
                    onChange={onChange}
                    inputProps={{
                      min: 0,
                      step: 1,
                    }}
                  />
                </Grid>
                <Grid item mt={1} md={6}>
                  <InputText
                    placeholder="Slots"
                    type="number"
                    name="numberSlots"
                    value={state.numberSlots}
                    disabled={slotsActive}
                    onChange={onChange}
                    inputProps={{
                      min: 0,
                      step: 1,
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
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
