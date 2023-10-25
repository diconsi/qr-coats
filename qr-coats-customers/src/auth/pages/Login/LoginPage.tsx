import { AuthLayout } from "@/auth/layout";
import { useFetchAndLoad } from "@/hooks";
import useForm from "@/hooks/useForm";
import { signIn } from "@/services";
import { GoogleLogin } from '@react-oauth/google';

import { startGoogleSignIn, startLoginWithEmailPassword } from "@/store/auth";
import { login, setErrorMessage } from "@/store/auth/authSlice";
import Google from "@mui/icons-material/Google";
import {
  Alert,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

const LoginPage = () => {
  const { status, errorMessage } = useSelector((store) => store.authState);
  const { callEndpoint } = useFetchAndLoad();

  const isAuthenticating = useMemo(() => status == "checking", [status]);
  const dispatch = useDispatch();
  const { onInputChange, userName, password, onResetForm, formState } = useForm(
    {
      userName: "",
      password: "",
    }
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await callEndpoint(
        signIn({ username: userName, password })
      );

      if (data && data.rol === "customer") {
        dispatch(login(data));
      } else {
        dispatch(setErrorMessage({ errorMessage: "Usuario no encontrado" }));
      }
    } catch (error) {
      console.error("Error durante la autenticación:", error);
      dispatch(
        setErrorMessage({ errorMessage: "Error durante la autenticación" })
      );
    }
  };

  // const onGoogleSingIn = () => {
  //   dispatch(startGoogleSignIn());
  // };

  const onSuccess=(response)=>{
    console.log(response)
  }

  const onError=()=>{
    console.log("response")
  }

  return (
    <AuthLayout title="Login">
      <form onSubmit={onSubmit}>
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Correo"
              type="text"
              placeholder="email@google.com"
              fullWidth
              variant="filled"
              color="primary"
              name="userName"
              value={userName}
              onChange={onInputChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Password"
              type="password"
              placeholder="Password"
              fullWidth
              variant="filled"
              color="primary"
              name="password"
              value={password}
              onChange={onInputChange}
            />
          </Grid>

          <Grid container display={!!errorMessage ? "" : "none"} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Alert severity="error">{errorMessage}</Alert>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Button
                disabled={isAuthenticating}
                type="submit"
                variant="contained"
                fullWidth
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button disabled={isAuthenticating} variant="contained" fullWidth>
              <GoogleLogin onSuccess={onSuccess} onError={onError} />
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container flexDirection="row" justifyContent="end">
          <Link component={RouterLink} color="inherit" to="/auth/register">
            Crear una cuenta
          </Link>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
