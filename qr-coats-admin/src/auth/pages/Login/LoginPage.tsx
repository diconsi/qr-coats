import { AuthLayout } from "@/auth/layout";
import { CustomButton, InputText } from "@/clube/components";
import { useAppDispatch, useAppSelector } from "@/hooks";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import { signIn } from "@/services/auth.services";
import { login, setErrorMessage } from "@/store/auth/authSlice";
import { stateValidator } from "@/tools";
import HttpsIcon from "@mui/icons-material/HttpsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import { Alert, Grid, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

interface UserData {
  rol: string;
}
interface UserState {
  userName: string;
  password: string;
  [key: string]: string;
}
const initialState: UserState = {
  userName: "ever",
  password: "chepsito",
};

interface ValidationRules {
  [key: string]: (value: string) => boolean;
}

const validationRules: ValidationRules = {
  userName: (value: string) => typeof value === "string" && value !== "",
  password: (value: string) => typeof value === "string" && value !== "",
};

const LoginPage = () => {
  const { errorMessage } = useAppSelector((store) => store.authState);

  const dispatch = useAppDispatch();
  const { callEndpoint } = useFetchAndLoad();

  const [userState, setUserState] = useState<UserState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(setErrorMessage(""));
  }, [dispatch]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    clearErrorAndMessage(name);
    setUserState({
      ...userState,
      [name]: value,
    });
  };

  const clearErrorAndMessage = (name: string) => {
    if (errorMessage !== "") {
      dispatch(setErrorMessage(""));
    }

    if (errors[name] !== "") {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const onSubmit = async () => {
    const newErrors = stateValidator(userState, validationRules);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      dispatch(
        setErrorMessage({
          errorMessage: "Please complete all fields correctly.",
        })
      );
    } else {
      setErrors({});

      try {
        const { data } = (await callEndpoint(
          signIn({ username: userState.userName, password: userState.password })
        )) as { data: UserData };
        if (data && data.rol === "admin") {
          dispatch(login(data));
        } else {
          dispatch(setErrorMessage({ errorMessage: "User not found" }));
        }
      } catch (error) {
        dispatch(setErrorMessage({ errorMessage: "User not found" }));
      }
    }
  };

  return (
    <AuthLayout title="WELCOME BACK!">
      <Typography sx={{ color: "white" }}>SIGN IN TO CONTINUE</Typography>
      <Grid container width={"100%"}>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <InputText
            type="email"
            name="userName"
            placeholder="Username"
            value={userState.userName}
            onChange={onChange}
            error={!!errors.userName}
            helperText={errors.userName}
            endAdornmentIcon={<PersonIcon />}
            sx={{ width: "50%" }}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <InputText
            type="password"
            name="password"
            placeholder="Enter password"
            value={userState.password}
            onChange={onChange}
            error={!!errors.password}
            helperText={errors.password}
            endAdornmentIcon={<HttpsIcon />}
            sx={{ width: "50%" }}
            showPassword={showPassword}
            onTogglePasswordVisibility={handleTogglePasswordVisibility}
          />
        </Grid>
        <Grid
          container
          display={errorMessage ? "" : "none"}
          sx={{ mt: 2, width: "100%" }}
        >
          <Grid display={"flex"} justifyContent={"center"} item xs={12} md={12}>
            <Alert sx={{ width: "50%" }} severity="error">
              {errorMessage}
            </Alert>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={12} md={12}>
            <CustomButton
              className="auth-button"
              onClick={onSubmit}
              label={"LOGIN"}
              fullWidth={true}
              style={{ width: "50%" }}
              background="linear-gradient(to bottom, #A482F2, #8CABF0)"
            />
          </Grid>
        </Grid>
      </Grid>
    </AuthLayout>
  );
};

export default LoginPage;
