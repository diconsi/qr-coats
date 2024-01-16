import { CustomButton, HeaderSectionPage, InputText } from "@/clube/components";
import { ClubeLayout } from "@/clube/layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import { addCustomField, deleteCustomField, updateClube } from "@/services";
import { updatedActiveClub } from "@/store/club/clubSlice";
import { CheckingAuth } from "@/ui";
import ErrorIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteIcon from "@mui/icons-material/HighlightOffOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import {
  Alert,
  ButtonGroup,
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
  price: string;
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
  const dispatch = useAppDispatch();
  const { callEndpoint, loading } = useFetchAndLoad();
  const { activeClub } = useAppSelector((store) => store.clubState);
  const {
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
    numberCustomFields,
  } = activeClub;

  const { access_token } = useAppSelector((store) => store.authState);

  useEffect(() => {
    setServiceData([...services]);
    setInformationGuest({ ...guestInfo });
    setWithCash(cash);
    setWithGateway(gateway);
    setBreakNumber(breakN);
    setBreakTime(breakT);
    setcustomFields(Fields ? Fields : []);
  }, [activeClub]);

  const [customFields, setcustomFields] = useState([
    {
      id: "",
      name: "",
      status: false,
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
      let inputValue = event.target.value.replace(/[^0-9.]/g, "");
      inputValue = inputValue === "" ? "0" : inputValue;
      const decimalCount = inputValue.split(".").length - 1;

      if (decimalCount <= 1) {
        setServiceData((prevServiceData) =>
          prevServiceData
            ? prevServiceData.map((service) =>
                service.id === serviceId
                  ? { ...service, price: inputValue }
                  : service
              )
            : []
        );
      }
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

  const handleNewCustomField = async () => {
    const id = uuidv4();
    const newCustomField = {
      id: id,
      name: custom,
    };
    const { data, status } = await callEndpoint(
      addCustomField(_id, newCustomField, access_token)
    );
    if (status === 200) {
      dispatch(updatedActiveClub(data));
      setCustom("");
    }
  };

  const onDeleteCustomField = async (id: string) => {
    const { status, data } = await callEndpoint(
      deleteCustomField(_id, { id: id }, access_token)
    );
    if (status === 200) {
      dispatch(updatedActiveClub(data));
    }
  };
  const filteredCustomFields = customFields.filter(
    (field) => field.status !== false
  );

  const disabledAddCustomInput =
    filteredCustomFields.length + 1 <= numberCustomFields;

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
            display="flex"
            alignItems={"center"}
            justifyContent={"center"}
            width={"100%"}
            height={"90%"}
            item
          >
            <Grid container height={"100%"} width={"100%"}>
              <Grid item md={12} xs={12} height={"80%"}>
                <Grid container width={"100%"} height={"100%"}>
                  <Grid item xs={12} md={6}>
                    <Grid container height={"100%"}>
                      <Grid item xs={12} md={12} p={2}>
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
                                  <Grid item xs={6} md={6}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          sx={{
                                            color: "white",
                                            "& .MuiSvgIcon-root": {
                                              color: "white",
                                            },
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
                                  <Grid item xs={6} md={6}>
                                    <InputText
                                      type="text"
                                      value={service.price}
                                      onChange={handleServicePriceChange(
                                        service.id
                                      )}
                                      disabled={
                                        !service.enable || !service.status
                                      }
                                      inputProps={{
                                        pattern: "[0-9]*[.]?[0-9]*",
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              ))}
                          </FormGroup>
                        </Container>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Grid container height={"100%"}>
                          <Grid item xs={12} md={5} p={2}>
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
                              <Typography
                                sx={{ position: "absolute", top: "5px" }}
                              >
                                PAYMENTS
                              </Typography>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      sx={{
                                        color: "white",
                                        "& .MuiSvgIcon-root": {
                                          color: "white",
                                        },
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
                                        "& .MuiSvgIcon-root": {
                                          color: "white",
                                        },
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
                          <Grid item xs={12} md={7} p={2}>
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
                              <Typography
                                sx={{ position: "absolute", top: "5px" }}
                              >
                                BREAK
                              </Typography>
                              <Grid container>
                                <Grid
                                  item
                                  xs={12}
                                  md={6}
                                  p={1}
                                  display={"flex"}
                                  flexDirection={"column"}
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                >
                                  <Typography textAlign={"center"}>
                                    BREAK TIME
                                  </Typography>

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
                                        setBreakTime((prevBreakTime) =>
                                          Math.max(prevBreakTime - 1, 0)
                                        )
                                      }
                                      style={{
                                        border: "none",
                                        borderRadius: "30px",
                                      }}
                                    />
                                    <Typography>{breakTime}</Typography>
                                    <CustomButton
                                      label={"+"}
                                      onClick={() =>
                                        setBreakTime(breakTime + 1)
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
                                  xs={12}
                                  md={6}
                                  p={1}
                                  display={"flex"}
                                  flexDirection={"column"}
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                >
                                  <Typography textAlign={"center"}>
                                    ALLOWED BREAKS
                                  </Typography>
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
                                        setBreakNumber((prevBreakNumber) =>
                                          Math.max(prevBreakNumber - 1, 0)
                                        )
                                      }
                                      style={{
                                        border: "none",
                                        borderRadius: "30px",
                                      }}
                                    />
                                    <Typography>{breakNumber}</Typography>
                                    <CustomButton
                                      label={"+"}
                                      onClick={() =>
                                        setBreakNumber(breakNumber + 1)
                                      }
                                      style={{
                                        border: "none",
                                        borderRadius: "30px",
                                      }}
                                    />
                                  </ButtonGroup>
                                </Grid>
                              </Grid>
                            </Container>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6} p={2}>
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
                      {withInformationGuest ? (
                        <Grid container height={"100%"} width={"100%"}>
                          <Grid
                            item
                            height={"10%"}
                            xs={12}
                            md={12}
                            display="flex"
                            justifyContent={"center"}
                          >
                            <FormGroup
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              {checkBoxOptions.map((option) => (
                                <FormControlLabel
                                  key={option.name}
                                  control={
                                    <Checkbox
                                      sx={{
                                        color: "white",
                                        "& .MuiSvgIcon-root": {
                                          color: "white",
                                        },
                                      }}
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
                            height={"15%"}
                            xs={12}
                            md={12}
                            display="flex"
                            justifyContent={"center"}
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
                              disabled={!disabledAddCustomInput}
                            />
                          </Grid>
                          <Grid item height={"75%"} xs={12} md={12}>
                            <Grid
                              container
                              width={"100%"}
                              sx={{
                                height: "100%",
                                overflowY: "scroll",
                                alignContent: "flex-start",
                              }}
                            >
                              {filteredCustomFields.map((custom) => (
                                <Grid item xs={12} md={3} key={custom.id}>
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
                                        onClick={() =>
                                          onDeleteCustomField(custom.id)
                                        }
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
                      ) : (
                        <Alert
                          icon={<ErrorIcon sx={{ color: "black" }} />}
                          sx={{
                            borderRadius: "30px",
                            bgcolor: "#D5E7FF",
                            color: "#2B2E3A",
                            fontSize: "18PX",
                            alignItems: "center",
                            fontFamily: "AttenBold",
                          }}
                        >
                          CONTACT ADMINISTRATOR TO ENABLE THIS FUNCTIONALITY
                        </Alert>
                      )}
                    </Container>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12} height={"20%"}></Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </ClubeLayout>
  );
};

export default Settings;
