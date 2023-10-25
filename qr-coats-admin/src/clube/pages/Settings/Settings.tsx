import {
  ContainerBorder,
  GridItemCenter,
  HeaderSectionPage,
} from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import { updateClube } from "@/services";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const Settings = () => {
  const { callEndpoint } = useFetchAndLoad();
  const {
    activeClub: {
      name: nameClub,
      whitInformationGuest,
      withGatewayPayment,
      informationGuest: guestInfo,
      withCash: cash,
      withGateway: gateway,
      breakNumber: breakN,
      breakTime: breakT,
      services,
      customFields: Fields,
      _id,
    },
  } = useSelector((store) => store.clubState);

  const { access_token } = useSelector((store) => store.authState);

  useEffect(() => {
    setServiceData([...services]);
    setInformationGuest({ ...guestInfo });
    setWithCash(cash);
    setWithGateway(gateway);
    setBreakNumber(breakN);
    setBreakTime(breakT);
    setcustomFields(Fields ? Fields : []);
  }, []);

  const [customFields, setcustomFields] = useState([]);
  const [breakTime, setBreakTime] = useState(0);
  const [breakNumber, setBreakNumber] = useState(0);
  const [withGateway, setWithGateway] = useState(false);
  const [withCash, setWithCash] = useState(false);
  const [informationGuest, setInformationGuest] = useState({
    name: false,
    lastName: false,
    email: false,
    phone: false,
  });

  const [serviceData, setServiceData] = useState();
  const handleUpdate = async () => {
    const updateSettings = {
      breakTime,
      breakNumber,
      withGateway,
      withCash,
      informationGuest,
      services: serviceData,
      customFields: customFields,
    };
    const resp = await callEndpoint(
      updateClube(_id, updateSettings, access_token)
    );

    console.log(resp);
  };

  const handleGateway = (e) => {
    setWithGateway(e.target.checked);
  };

  const handleCash = (e) => {
    setWithCash(e.target.checked);
  };

  const handleServiceStatusChange = (serviceId) => (event) => {
    const statusService = event.target.checked;
    if (!statusService) {
      const simulatedEvent = {
        target: {
          value: "0",
        },
      };
      handleServicePriceChange(serviceId)(simulatedEvent);
    }
    setServiceData((prevServiceData) =>
      prevServiceData.map((service) =>
        service.id === serviceId
          ? { ...service, status: statusService }
          : service
      )
    );
  };

  const handleServicePriceChange = (serviceId) => (event) => {
    const value =
      event.target.value === "" ? 0 : parseFloat(event.target.value);
    setServiceData((prevServiceData) =>
      prevServiceData.map((service) =>
        service.id === serviceId ? { ...service, price: value } : service
      )
    );
  };

  const handleChange = (name) => (event) => {
    setInformationGuest({ ...informationGuest, [name]: event.target.checked });
  };

  const checkBoxOptions = [
    { name: "name", label: "Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
  ];
  const [custom, setCustom] = useState("");

  const handleNewCustomField = () => {
    const id = uuidv4();
    const newCustomField = {
      id: id,
      name: custom,
    };
    setcustomFields([...customFields, newCustomField]);
    setCustom("");
  };

  return (
    <ClubeLayout>
      <Container sx={{ height: "80%", maxWidth: "100% !important" }}>
        <HeaderSectionPage
          title={`${nameClub} - Settings`}
          titleButton="Update"
          onClick={handleUpdate}
          icon={<UpdateOutlinedIcon />}
        />
        <Grid container sx={{ height: "50%", width: "100%" }}>
          <GridItemCenter>
            <ContainerBorder title="Login Guest Information">
              <Grid item md={6} display="flex" justifyContent="center">
                <FormGroup>
                  {checkBoxOptions.map((option) => (
                    <FormControlLabel
                      key={option.name}
                      control={
                        <Checkbox
                          disabled={whitInformationGuest}
                          checked={informationGuest[option.name]}
                          onChange={handleChange(option.name)}
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </FormGroup>
              </Grid>
              <Grid
                item
                md={6}
                display="flex"
                height="100%"
                justifyContent="center"
              >
                <Grid container height="100%" padding={2}>
                  <Grid container height="50%">
                    <TextField
                      fullWidth
                      value={custom}
                      placeholder="Add Custom Field"
                      onChange={(e) => setCustom(e.target.value)}
                      label="Custom Field"
                    />
                    <Button
                      onClick={handleNewCustomField}
                      fullWidth
                      variant="contained"
                    >
                      Add
                    </Button>
                  </Grid>
                  <Grid container height="50%">
                    {customFields.map((custom) => (
                      <Grid item md={12} key={custom.id}>
                        {custom.name}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </ContainerBorder>
          </GridItemCenter>
          <GridItemCenter>
            <ContainerBorder title=" Services">
              <Grid>
                <FormGroup>
                  {serviceData !== undefined &&
                    serviceData.map((service) => (
                      <Grid
                        container
                        sx={{ alignItems: "center", mt: 1 }}
                        key={service.id}
                      >
                        <Grid item md={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={!service.enable}
                                checked={service.status}
                                onChange={handleServiceStatusChange(service.id)}
                              />
                            }
                            label={service.name}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <TextField
                            label="Price without taxes"
                            type="text"
                            value={service.price}
                            onChange={handleServicePriceChange(service.id)}
                            disabled={!service.enable || !service.status}
                          />
                        </Grid>
                      </Grid>
                    ))}
                </FormGroup>
              </Grid>
            </ContainerBorder>
          </GridItemCenter>
        </Grid>
        <Grid container sx={{ height: "50%", width: "100%" }}>
          <GridItemCenter>
            <ContainerBorder title="Payments">
              <GridItemCenter>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={!withGatewayPayment}
                        checked={withGateway}
                        onChange={handleGateway}
                      />
                    }
                    label="Gateway Payment"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={withCash} onChange={handleCash} />
                    }
                    label="Cash Payment"
                  />
                </FormGroup>
              </GridItemCenter>
            </ContainerBorder>
          </GridItemCenter>
          <GridItemCenter>
            <ContainerBorder title="Break">
              <Grid container flexDirection="column" sx={{ width: "50%" }}>
                <TextField
                  label="Break Time"
                  type="number"
                  value={breakTime}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setBreakTime(value);
                  }}
                />
                <TextField
                  label="Allowed Breaks"
                  type="number"
                  value={breakNumber}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setBreakNumber(value);
                  }}
                  sx={{ mt: 1 }}
                />
              </Grid>
            </ContainerBorder>
          </GridItemCenter>
        </Grid>
      </Container>
    </ClubeLayout>
  );
};

export default Settings;
