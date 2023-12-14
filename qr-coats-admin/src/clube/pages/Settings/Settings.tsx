import { CustomButton, HeaderSectionPage, InputText } from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { useAppSelector } from "@/hooks";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import { updateClube } from "@/services";
import { CheckingAuth } from "@/ui";
import { Label } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/HighlightOffOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import {
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

interface IService {
  enable: boolean;
  id: string;
  name: string;
  price: number;
  status: boolean;
}

interface IInformationGuest {
  name: boolean;
  lastName: boolean;
  email: boolean;
  phone: boolean;
}

interface ICheckBoxOption {
  name: keyof IInformationGuest;
  label: string;
}

const Settings = () => {
  const { callEndpoint, loading } = useFetchAndLoad();
  const {
    activeClub: {
      withInformationGuest,
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
  } = useAppSelector((store) => store.clubState);

  const { access_token } = useAppSelector((store) => store.authState);

  useEffect(() => {
    setServiceData([...services]);
    setInformationGuest({ ...guestInfo });
    setWithCash(cash);
    setWithGateway(gateway);
    setBreakNumber(breakN);
    setBreakTime(breakT);
    setcustomFields(Fields ? Fields : []);
  }, []);

  const [customFields, setcustomFields] = useState([
    {
      id: "",
      name: "",
    },
  ]);
  const [breakTime, setBreakTime] = useState(0);
  const [breakNumber, setBreakNumber] = useState(0);
  const [withGateway, setWithGateway] = useState(false);
  const [withCash, setWithCash] = useState(false);
  const [informationGuest, setInformationGuest] = useState<IInformationGuest>({
    name: false,
    lastName: false,
    email: false,
    phone: false,
  });

  const [serviceData, setServiceData] = useState<IService[]>([]);
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

  const handleGateway = (e: ChangeEvent<HTMLInputElement>) => {
    setWithGateway(e.target.checked);
  };

  const handleCash = (e: ChangeEvent<HTMLInputElement>) => {
    setWithCash(e.target.checked);
  };

  const handleServiceStatusChange =
    (serviceId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const statusService = event.target.checked;
      if (!statusService) {
        const simulatedEvent = {
          target: { value: "0" },
        } as ChangeEvent<HTMLInputElement>;
        handleServicePriceChange(serviceId)(simulatedEvent);
      }
      setServiceData((prevServiceData) =>
        prevServiceData
          ? prevServiceData.map((service) =>
              service.id === serviceId
                ? { ...service, status: statusService }
                : service
            )
          : []
      );
    };

  const handleServicePriceChange =
    (serviceId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.value === "" ? 0 : parseFloat(event.target.value);
      setServiceData((prevServiceData) =>
        prevServiceData
          ? prevServiceData.map((service) =>
              service.id === serviceId ? { ...service, price: value } : service
            )
          : []
      );
    };

  const handleChange =
    (name: keyof IInformationGuest) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setInformationGuest({
        ...informationGuest,
        [name]: event.target.checked,
      });
    };

  const checkBoxOptions: ICheckBoxOption[] = [
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
      {loading ? (
        <CheckingAuth />
      ) : (
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
              title={"SETTINGS"}
              titleButton="Update"
              onClick={handleUpdate}
              icon={<UpdateOutlinedIcon />}
            />
          </Grid>
          <Grid
            container
            sx={{
              height: "90%",
              width: "100%",
              overflowY: { xs: "scroll", md: "initial" },
            }}
          >
            <Grid item md={12} sx={{ height: { md: "70%" } }}>
              <Grid container height={"100%"}>
                <Grid item md={6} xs={12} p={2}>
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      p: 3,
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "5px" }}>
                      SERVICES
                    </Typography>
                    <FormGroup
                      sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
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
                                    sx={{
                                      color: "white",
                                      "& .MuiSvgIcon-root": { color: "white" },
                                    }}
                                    disabled={!service.enable}
                                    checked={service.status}
                                    onChange={handleServiceStatusChange(
                                      service.id
                                    )}
                                  />
                                }
                                label={service.name}
                              />
                            </Grid>
                            <Grid item md={6}>
                              <InputText
                                type="text"
                                value={service.price}
                                onChange={handleServicePriceChange(service.id)}
                                disabled={!service.enable || !service.status}
                              />
                            </Grid>
                          </Grid>
                        ))}
                    </FormGroup>
                  </Container>
                </Grid>
                <Grid item md={6} xs={12} p={2}>
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      p: 3,
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "5px" }}>
                      LOGIN GUEST INFORMATION
                    </Typography>
                    <Grid container width={"100%"}>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        display="flex"
                        alignItems="center"
                      >
                        <FormGroup>
                          {checkBoxOptions.map((option) => (
                            <FormControlLabel
                              key={option.name}
                              control={
                                <Checkbox
                                  sx={{
                                    color: "white",
                                    "& .MuiSvgIcon-root": { color: "white" },
                                  }}
                                  disabled={withInformationGuest}
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
                        md={8}
                        xs={12}
                        display="flex"
                        height="100%"
                        width={"100%"}
                        justifyContent="center"
                      >
                        <Grid container height="100%" width={"100%"}>
                          <Grid
                            item
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}
                            md={12}
                            height="20%"
                            width={"100%"}
                          >
                            <InputText
                              type="text"
                              placeholder="Custom Field"
                              name="customField"
                              value={custom}
                              onChange={(e) => setCustom(e.target.value)}
                            />
                            <CustomButton
                              label="ADD"
                              onClick={handleNewCustomField}
                              style={{ marginLeft: "10px" }}
                            />
                          </Grid>
                          <Grid
                            item
                            md={12}
                            width={"100%"}
                            height="80%"
                            sx={{
                              overflowY: "scroll",
                              "&::-webkit-scrollbar": {
                                width: "0",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            <Grid container width={"100%"}>
                              {customFields.map((custom) => (
                                <Grid item xs={12} md={6} key={custom.id}>
                                  <Grid
                                    container
                                    sx={{
                                      backgroundColor: "#9393AB",
                                      borderRadius: "30px",
                                      margin: " 2px",
                                      color: "white",
                                      width: "100%",
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
                                      <Typography sx={{ ml: 2 }}>
                                        {custom.name}
                                      </Typography>
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
                                        aria-label="Eliminar"
                                        sx={{ color: "white" }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Container>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12} sx={{ height: { md: "30%" } }}>
              <Grid container height={"100%"}>
                <Grid item md={3} xs={12} p={2}>
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      p: 3,
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "5px" }}>
                      PAYMENTS
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              color: "white",
                              "& .MuiSvgIcon-root": { color: "white" },
                            }}
                            disabled={!withGatewayPayment}
                            checked={withGateway}
                            onChange={handleGateway}
                          />
                        }
                        label="Gateway Payment"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              color: "white",
                              "& .MuiSvgIcon-root": { color: "white" },
                            }}
                            checked={withCash}
                            onChange={handleCash}
                          />
                        }
                        label="Cash Payment"
                      />
                    </FormGroup>
                  </Container>
                </Grid>
                <Grid item md={3} xs={12} p={2}>
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      p: 3,
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "5px" }}>
                      BREAK
                    </Typography>
                    <Grid container>
                      <Grid item xs={12} md={6}>
                        <Typography>BREAK TIME</Typography>
                        <InputText
                          type="number"
                          value={breakTime}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setBreakTime(value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>ALLOWED BREAKS</Typography>
                        <InputText
                          type="number"
                          value={breakNumber}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setBreakNumber(value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Container>
                </Grid>
                {/* <Grid item md={6} xs={12} p={2}>
                  <Container
                    sx={{
                      bgcolor: "#2E313D",
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      p: 3,
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "5px" }}>
                      BREAK
                    </Typography>
                    <Grid container>
                      <Grid item xs={12} md={6}>
                        <Typography>BREAK TIME</Typography>
                        <InputText
                          type="number"
                          value={breakTime}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setBreakTime(value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>ALLOWED BREAKS</Typography>
                        <InputText
                          type="number"
                          value={breakNumber}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setBreakNumber(value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Container>
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </ClubeLayout>
  );
};

export default Settings;
