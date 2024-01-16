import { Grid, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomButton, InputText } from "@/clube/components";
import { useAppSelector, useFetchAndLoad } from "@/hooks";
import { updateUser } from "@/services";

interface Field {
  name: string;
  visible: boolean;
  status?: boolean;
}

interface GuestFormState {
  [key: string]: string;
}

const GuestForm: React.FC = () => {
  const { callEndpoint } = useFetchAndLoad();
  const {
    activeClub: { customFields, informationGuest },
  } = useAppSelector((store) => store.clubState);
  const { uid, access_token } = useAppSelector((store) => store.authState);

  const guestFields: Field[] = Object.entries(informationGuest).map(
    ([name, visible]) => ({
      name,
      visible,
    })
  );

  const customInputs: Field[] = (customFields || []).map((item) => ({
    name: item.name,
    visible: item.status,
  }));

  const fields: Field[] = [
    ...customInputs.map((item) => ({ ...item})),
    ...guestFields.map((item) => ({ ...item, id: uuidv4() })),
  ];

  const [initialState, setInitialState] = useState<GuestFormState>(() =>
    fields
      .filter((item) => item.visible)
      .reduce<GuestFormState>((acc, item) => {
        acc[item.name] = "";
        return acc;
      }, {})
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInitialState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const { data } = await callEndpoint(
      updateUser(
        uid,
        { ...initialState, customFields: initialState },
        access_token
      )
    );
    // Revisar lógica
    console.log(data);
  };
console.log(fields)
  return (
    <Grid
      container
      display={"flex"}
      justifyContent={"center"}
      sx={{ width: "100%" }}
    >
      <Grid
        container
        display={"flex"}
        justifyContent={"center"}
        sx={{ width: "100%" }}
      >
        <Typography textAlign={"center"}>
          Enter information to continue
        </Typography>
        {fields.map((item) => {
          if (item.visible) {
            return (
              <Grid
                padding={1}
                item
                key={item.name}
                display="flex"
                justifyContent="center"
                alignItems="center"
                md={6}
                xs={6}
              >
                <InputText
                  label={item.name.toUpperCase()}
                  type="text"
                  name={item.name}
                  placeholder={`ENTER ${item.name.toUpperCase()}`}
                  value={initialState[item.name]}
                  onChange={onChange}
                />
              </Grid>
            );
          }
          return null;
        })}
      </Grid>
      <CustomButton label="Save" onClick={handleSave} fullWidth={false} />
    </Grid>
  );
};

export default GuestForm;
