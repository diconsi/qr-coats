import {
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthLayout } from "@/auth/layout";
import useForm from "@/hooks/useForm";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startCreatingUserWithEmailPassword } from "@/store/auth";
import { useFetchAndLoad } from "@/hooks";
import { signUp } from "@/services";
const initialForm = {
  name: "",
  username: "",
  email: "",
  password: "",
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { callEndpoint } = useFetchAndLoad();
  const { status, errorMessage } = useSelector((store) => store.authState);
  const isCheckingAuthentication = useMemo(
    () => status === "checking",
    [status]
  );
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    formState,
    onInputChange,
    onResetForm,
    name,
    username,
    email,
    password,
  } = useForm(initialForm);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const newUser = {
      name,
      username,
      email,
      password,
      rol: "customer",
    };
    const resp = await callEndpoint(signUp(newUser));
    console.log(resp);
  };
  return (
    <AuthLayout title="Register">
      <form onSubmit={onSubmit}>
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Nombre completo"
              type="text"
              placeholder="Nombre completo"
              fullWidth
              variant="filled"
              color="primary"
              name="name"
              value={name}
              onChange={onInputChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              type="text"
              placeholder="Username"
              fullWidth
              variant="filled"
              color="primary"
              name="username"
              value={username}
              onChange={onInputChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              placeholder="email@google.com"
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

          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            {/* <Grid display={!!errorMessage ? "" : "none"} item xs={12} md={6}>
              <Alert severity="error">{errorMessage}</Alert>
            </Grid> */}
            <Grid item xs={12} md={6}>
              <Button
                disabled={isCheckingAuthentication}
                type="submit"
                variant="contained"
                fullWidth
              >
                Crear cuenta
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container flexDirection="row" justifyContent="end">
          <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta ?</Typography>
          <Link component={RouterLink} color="inherit" to="/auth/login">
            Ingresar
          </Link>
        </Grid>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
