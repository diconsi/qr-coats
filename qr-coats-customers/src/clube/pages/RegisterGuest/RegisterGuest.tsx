import { AuthLayout } from "@/auth/layout";
import { clubManagmentPath } from "@/constants";
import { useRedirectTo } from "@/hooks";
import { startSaveGuestInformation } from "@/store/club";
import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const RegisterGuest = () => {
  const {
    activeClub: { customFields, informationGuest },
  } = useSelector((store) => store.clubState);
  const redirectTo = useRedirectTo();

  const dispacth = useDispatch();

  const guestFields = Object.entries(informationGuest).map(
    ([name, visible]) => ({
      name,
      visible,
    })
  );
  
  const c= customFields?customFields:[]

  const fields = [
    ...c.map((item) => ({ ...item, visible: true })),
    ...guestFields.map((item) => ({ ...item, id: uuidv4() })),
  ];

  const [fieldState, setFieldState] = useState(fields);

  const handleFieldChange = (fieldName, value) => {
    setFieldState((prevState) =>
      prevState.map((field) =>
        field.name === fieldName ? { ...field, value } : field
      )
    );
  };

  const handleSave = () => {
    const guestInformation = fieldState.filter((item) => item.visible);
    dispacth(startSaveGuestInformation(guestInformation));
    redirectTo(clubManagmentPath);
  };

  return (
    <AuthLayout title="Required Information">
      {fieldState.map((item) => {
        if (item.visible) {
          return (
            <Grid
              padding={1}
              item
              key={item.name}
              display="flex"
              justifyContent="center"
              alignItems="center"
              md={12}
            >
              <TextField
                label={item.name}
                variant="outlined"
                value={item.value || ""}
                onChange={(e) => handleFieldChange(item.name, e.target.value)}
              />
            </Grid>
          );
        }
        return null;
      })}
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </AuthLayout>
  );
};

export default RegisterGuest;
