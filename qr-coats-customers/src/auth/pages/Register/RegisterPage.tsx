import { AuthLayout } from "@/auth/layout";
import { CustomButton, InputText } from "@/clube/components";
import { loginPath } from "@/constants";
import { useAppDispatch, useAppSelector, useFetchAndLoad } from "@/hooks";
import { login, setErrorMessage } from "@/store/auth/authSlice";
import { stateValidator } from "@/tools";
import WritingIcon from "@mui/icons-material/DriveFileRenameOutline";
import HttpsIcon from "@mui/icons-material/HttpsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import { Alert, Grid, Link } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { signIn, signUp } from "@/services";

interface IUser {
  name: string;
  userName: string;
  email: string;
  password: string;
  [key: string]: string;
}

const initialState: IUser = {
  name: "",
  userName: "",
  email: "",
  password: "",
};

interface UserData {
  username: string;
  password: string;
  rol: string;
}

interface ValidationRules {
  [key: string]: (value: string) => boolean;
}

const validationRules: ValidationRules = {
  name: (value: string) => typeof value === "string" && value !== "",
  userName: (value: string) => typeof value === "string" && value !== "",
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof value === "string" && value !== "" && emailRegex.test(value);
  },
  password: (value: string) => typeof value === "string" && value !== "",
};

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const { callEndpoint } = useFetchAndLoad();
  const [userState, setUserState] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { errorMessage } = useAppSelector((store) => store.authState);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (errorMessage !== "") dispatch(setErrorMessage(""));

    if (errors[name] !== "") delete errors[name];
    setUserState({
      ...userState,
      [name]: value,
    });
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
        const newUser = {
          name: userState.name,
          username: userState.userName,
          email: userState.email,
          password: userState.password,
          rol: "customer",
          isAnonymous: false,
        };
        const { data } = await callEndpoint(signUp(newUser));
        const { username } = data as UserData;
        try {
          const { data } = (await callEndpoint(
            signIn({ username: username, password: newUser.password })
          )) as { data: UserData };
          if (data && data.rol === "customer") {
            dispatch(login(data));
          } else {
            dispatch(setErrorMessage({ errorMessage: "User not found" }));
          }
        } catch (error) {
          dispatch(setErrorMessage({ errorMessage: "User not found" }));
        }
      } catch (error) {
        dispatch(
          setErrorMessage({ errorMessage: "Error during registration" })
        );
      }
    }
  };

  return (
    <AuthLayout title="REGISTER">
      <Grid
        container
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={12} md={12} mt={2}>
          <InputText
            type="text"
            name="name"
            placeholder="Enter full name"
            value={userState.name}
            onChange={onChange}
            error={!!errors.name}
            helperText={errors.name}
            endAdornmentIcon={<WritingIcon />}
          />
        </Grid>
        <Grid item xs={12} md={12} mt={2}>
          <InputText
            type="text"
            name="userName"
            placeholder="Enter username"
            value={userState.userName}
            onChange={onChange}
            error={!!errors.userName}
            helperText={errors.userName}
            endAdornmentIcon={<PersonIcon />}
          />
        </Grid>
        <Grid item xs={12} md={12} mt={2}>
          <InputText
            type="email"
            name="email"
            placeholder="Enter email"
            value={userState.email}
            onChange={onChange}
            error={!!errors.email}
            helperText={errors.email}
            endAdornmentIcon={<EmailIcon />}
          />
        </Grid>
        <Grid item xs={12} md={12} mt={2}>
          <InputText
            type="password"
            name="password"
            placeholder="Enter password"
            value={userState.password}
            onChange={onChange}
            error={!!errors.password}
            helperText={errors.password}
            endAdornmentIcon={<HttpsIcon />}
            showPassword={showPassword}
            onClickIcon={handleTogglePasswordVisibility}
          />
        </Grid>
        <Grid container display={errorMessage ? "" : "none"} sx={{ mt: 2 }}>
          <Grid item xs={12} md={12}>
            <Alert severity="error">{errorMessage}</Alert>
          </Grid>
        </Grid>
        <Grid container mt={2}>
          <Grid item xs={12} md={12}>
            <CustomButton
              onClick={onSubmit}
              label={"Sign up"}
              fullWidth={true}
            />
          </Grid>
        </Grid>
        <Grid container mt={2} flexDirection="row" justifyContent="end">
          <span
            style={{
              fontWeight: "normal",
              fontSize: "14px",
              marginRight: "5px",
            }}
          >
            DO YOU ALREADY HAVE AN ACCOUNT?
          </span>
          <Link
            component={RouterLink}
            style={{ color: "white", textDecoration: "none" }}
            to={loginPath}
          >
            LOG IN
          </Link>
        </Grid>
      </Grid>
    </AuthLayout>
  );
};

export default RegisterPage;
