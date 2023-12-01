import { ChangeEvent, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert, Grid, Link, Typography } from "@mui/material";
import HttpsIcon from "@mui/icons-material/HttpsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import { AuthLayout } from "@/auth/layout";
import { CustomButton, InputText } from "@/clube/components";
import { resgiterPath } from "@/constants";
import { useAppDispatch, useAppSelector, useFetchAndLoad } from "@/hooks";
import { signIn } from "@/services";
import { login, setErrorMessage } from "@/store/auth/authSlice";
import { stateValidator } from "@/tools";

interface UserData {
  rol: string;
}

interface UserState {
  userName: string;
  password: string;
  [key: string]: string;
}

const initialState: UserState = {
  userName: "chepsito",
  password: "123456",
};

interface ValidationRules {
  [key: string]: (value: string) => boolean;
}

const validationRules: ValidationRules = {
  userName: (value: string) => typeof value === "string" && value !== "",
  password: (value: string) => typeof value === "string" && value !== "",
};

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { callEndpoint } = useFetchAndLoad();
  const [userState, setUserState] = useState<UserState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { errorMessage } = useAppSelector((store) => store.authState);
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
        if (data && data.rol === "customer") {
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
      <Typography sx={{ mt: 2 }}>SIGN IN TO CONTINUE</Typography>
      <Grid container>
        <Grid item xs={12} sx={{ mt: 2 }}>
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
            showPassword={showPassword}
            onTogglePasswordVisibility={handleTogglePasswordVisibility}
          />
        </Grid>
        <Grid container display={errorMessage ? "" : "none"} sx={{ mt: 2 }}>
          <Grid item xs={12} md={12}>
            <Alert severity="error">{errorMessage}</Alert>
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 2 }}>
          <Grid item xs={12} md={12}>
            <CustomButton
              className="auth-button"
              onClick={onSubmit}
              label={"LOGIN"}
              fullWidth={true}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container flexDirection="row" justifyContent="end" mt={2}>
        <Link component={RouterLink} color="inherit" to={resgiterPath}>
          CREATE YOUR ACCOUNT
        </Link>
      </Grid>
    </AuthLayout>
  );
};

export default LoginPage;
