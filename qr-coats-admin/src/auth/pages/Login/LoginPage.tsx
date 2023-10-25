import { AuthLayout } from "@/auth/layout";
import useFetchAndLoad from "@/hooks/useFetchAndLoad";
import useForm from "@/hooks/useForm";
import { signIn } from "@/services/auth.services";
import { startLoginWithEmailPassword } from "@/store/auth";
import { login, setErrorMessage } from "@/store/auth/authSlice";
import { Alert, Button, Grid, TextField } from "@mui/material";
import { FormEvent, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoginPage = () => {
  const { callEndpoint } = useFetchAndLoad();
  const { status, errorMessage } = useSelector((store) => store.authState);

  const isAuthenticating = useMemo(() => status == "checking", [status]);
  const dispatch = useDispatch();
  const { onInputChange, email, password, onResetForm, formState } = useForm({
    email: "",
    password: "",
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { data } = await callEndpoint(signIn({ username: email, password }));
    if (data && data.rol === "admin") {
      dispatch(login(data));
    } else {
      dispatch(setErrorMessage({ errorMessage: "Usuario no encontrado" }));
    }
  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={onSubmit}>
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              type="text"
              placeholder="Username"
              fullWidth
              variant="filled"
              color="primary"
              name="email"
              value={email}
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

          <Grid item xs={12} md={6} sx={{ mt: 2 }}>
            <Button
              disabled={isAuthenticating}
              type="submit"
              variant="contained"
              fullWidth
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
