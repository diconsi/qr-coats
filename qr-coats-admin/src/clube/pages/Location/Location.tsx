import {
  ContainerBorder,
  InputSwitch,
  ModalComponent,
} from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { applySortFilter, getComparator } from "@/tools/tools";
import {
  DeleteOutline,
  EditOutlined,
  MoreVertOutlined,
} from "@mui/icons-material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TableList from "@/clube/components/Table/TableList";
import {
  TABLE_HEAD,
  deleteLocation,
  editLocation,
  newLocation,
} from "@/constants/locations";
import {
  startDeletingLocation,
  startLoadingLocations,
  startSaveLocation,
  startUpdateLocation,
} from "@/store/location";
import { setActiveLocation } from "@/store/location/locationSlice";

const Location = () => {
  const { locations, activeLocation } = useSelector(
    (store) => store.locationState
  );

  const {
    activeClub: { slotsActive, numberLocations, name: clubName },
  } = useSelector((store) => store.clubState);

  const disableButton = locations.length < numberLocations;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoadingLocations());
  }, []);

  useEffect(() => {
    if (activeLocation != null) {
      setName(activeLocation.name);
      setHanges(activeLocation.numberHanges);
      setSlots(activeLocation.numberSlots);
      setType(activeLocation.locationType);
      setStatus(activeLocation.status);
    }
  }, [activeLocation]);

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [titleModal, setTitleModal] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [hanges, setHanges] = useState(0);
  const [slots, setSlots] = useState(0);
  const [status, setStatus] = useState(true);
  const [type, setType] = useState("");

  const handleOpenMenu = (event, row) => {
    dispatch(setActiveLocation(row));
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - locations.length) : 0;

  const filteredLocations = applySortFilter(
    locations,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredLocations.length && !!filterName;

  const handleActioModal = (titleModal: string) => {
    setTitleModal(titleModal);
    setShowModal(true);
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    resetIpunts();
    setShowModal(false);
    dispatch(setActiveLocation(null));
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleNumberChange = (event, type) => {
    const newValue = event.target.value;
    if (
      !isNaN(newValue) &&
      Number.isInteger(Number(newValue)) &&
      Number(newValue) >= 0
    ) {
      type === "slots" ? setSlots(newValue) : setHanges(newValue);
    }
  };

  const resetIpunts = () => {
    setTitleModal("");
    setName("");
    setHanges(0);
    setSlots(0);
    setType("");
    setStatus(true);
  };

  const onSave = () => {
    if (titleModal === newLocation) {
      const newLocation = {
        name,
        numberHanges: hanges,
        numberSlots: slots,
        status,
        locationType: type,
      };
      dispatch(startSaveLocation(newLocation));
    }

    if (titleModal === editLocation) {
      const newLocation = {
        name,
        numberHanges: hanges,
        numberSlots: slots,
        status,
        locationType: type,
      };
      dispatch(startUpdateLocation(newLocation));
    }

    if (titleModal === deleteLocation) {
      dispatch(startDeletingLocation());
    }

    resetIpunts();
    handleCloseModal();
    dispatch(setActiveLocation(null));
  };

  const renderBody = () => {
    if (titleModal === deleteLocation) {
      return (
        <Grid item sx={{ width: "100%" }}>
          Do you want to delete the <strong>record?</strong>
        </Grid>
      );
    }

    if (titleModal === editLocation || titleModal === newLocation) {
      return (
        <Grid container>
          <Grid item mt={1} md={12}>
            <TextField
              fullWidth
              type="text"
              label="Name"
              placeholder="Name Location"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item mt={1} md={6} sx={{ pr: 0.5 }}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Type</InputLabel>
              <Select value={type} onChange={handleTypeChange} label="Género">
                <MenuItem value="">
                  <em>Seleccionar</em>
                </MenuItem>
                <MenuItem value="Item Cheker">Item Cheker</MenuItem>
                <MenuItem value="Entry">Entry</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item mt={1} md={6} sx={{ pl: 0.5 }}>
            <ContainerBorder
              width={"100 %"}
              height={"100%"}
              padding={"0px"}
              title={""}
            >
              <InputSwitch
                checked={status}
                handleChange={setStatus}
                label="Location Status"
              />
            </ContainerBorder>
          </Grid>
          {type !== "Entry" && (
            <>
              <Grid item mt={1} md={6}>
                <TextField
                  fullWidth
                  label="Hangers"
                  type="number"
                  placeholder="Hangers"
                  value={hanges}
                  onChange={(e) => handleNumberChange(e, "hanges")}
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
                  disabled={!slotsActive}
                  value={slots}
                  onChange={(e) => handleNumberChange(e, "slots")}
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
      );
    }
    return null;
  };

  const renderFooter = () => {
    return (
      <Grid
        container
        mt={1}
        spacing={2}
        flexDirection="row"
        justifyContent="end"
      >
        <Button onClick={handleCloseModal} variant="contained">
          Cancelar
        </Button>
        <Button
          sx={{ ml: 2 }}
          onClick={onSave}
          variant="contained"
          color={titleModal === deleteLocation ? "error" : undefined}
        >
          {titleModal === newLocation
            ? "Guardar"
            : titleModal === editLocation
            ? "Editar"
            : "Eliminar"}
        </Button>
      </Grid>
    );
  };
  return (
    <ClubeLayout>
      <Container sx={{ height: "80%", maxWidth: "100% !important" }}>
        <TableList
          disableButton={!disableButton}
          dataTable={locations}
          filterName={filterName}
          setFilterName={setFilterName}
          title={`${clubName} - Locations`}
          titleButton={newLocation}
          handleActioModal={() => handleActioModal(newLocation)}
          tableHead={TABLE_HEAD}
          rowCount={locations.length}
          isNotFound={isNotFound}
          selected={selected}
          setSelected={setSelected}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          page={page}
          setPage={setPage}
          order={order}
          setOrder={setOrder}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          iconHeaderSection={<MapOutlinedIcon />}
        >
          <TableBody>
            {filteredLocations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const {
                  id,
                  name,
                  locationType,
                  numberHanges,
                  numberSlots,
                  status,
                } = row;
                const selectedUser = selected.indexOf(name) !== -1;
                return (
                  <TableRow
                    hover
                    key={id}
                    tabIndex={-1}
                    role="checkbox"
                    selected={selectedUser}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUser}
                        onChange={(event) => handleClick(event, name)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="subtitle2" noWrap>
                          {name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">{locationType}</TableCell>
                    <TableCell align="left">{numberHanges}</TableCell>
                    <TableCell align="left">{numberSlots}</TableCell>
                    <TableCell align="left">
                      <Alert severity={status ? "success" : "error"}>
                        <Typography>
                          {status ? "Active" : "Inactive"}
                        </Typography>
                      </Alert>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="large"
                        color="inherit"
                        onClick={(event) => handleOpenMenu(event, row)}
                      >
                        <MoreVertOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </TableList>
      </Container>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: "11%",
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleActioModal(editLocation)}>
          <EditOutlined />
          {editLocation}
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => handleActioModal(deleteLocation)}
        >
          <DeleteOutline />
          {deleteLocation}
        </MenuItem>
      </Popover>
      <ModalComponent
        title={titleModal}
        showModal={showModal}
        onHide={handleCloseModal}
        body={renderBody()}
        footer={renderFooter()}
        center
      />
    </ClubeLayout>
  );
};

export default Location;
