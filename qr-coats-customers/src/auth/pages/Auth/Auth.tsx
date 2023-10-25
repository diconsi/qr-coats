import qrIcon from "@/assets/Icon-192.png";
import { AuthLayout } from "@/auth/layout";
import { loginPath, resgiterPath } from "@/constants";
import { useFetchAndLoad, useRedirectTo } from "@/hooks";
import { startGoogleSignIn, startLoginAnonymously } from "@/store/auth";
import { Google } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { signInGoogle } from "@/services";
import { login, setErrorMessage } from "@/store/auth/authSlice";

const Auth = () => {
  const redirectTo = useRedirectTo();
  const dispatch = useDispatch();
  const { callEndpoint } = useFetchAndLoad();

  const onLogin = () => {
    redirectTo(loginPath);
  };

  const onLoginAnonymously = () => {
    dispatch(startLoginAnonymously());
  };

  const onSuccess = async (response) => {
    const { credential } = response;
    const { data } = await callEndpoint(signInGoogle(credential));
    if (data && data.rol === "customer") {
      dispatch(login(data));
    } else {
      dispatch(setErrorMessage({ errorMessage: "Usuario no encontrado" }));
    }
  };

  const onError = () => {
    console.log("response");
  };
  return (
    <AuthLayout>
      <Grid container justifyContent="center">
        <Grid container justifyContent="center">
          <img src={qrIcon} className="auth-image" />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={onLoginAnonymously} fullWidth variant="contained">
            Start
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button onClick={onLogin} fullWidth variant="contained">
            I HAVE AN ACCOUNT
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography>
            DON´T HAVE AN ACCOUNT ?<Link to={resgiterPath}> CREATE ONE </Link>
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" align="center">
            {" "}
            SIGN IN WITH{" "}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          <Grid item xs={12} md={6}>
            <GoogleLogin onSuccess={onSuccess} onError={onError} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained" fullWidth>
              <Typography sx={{ ml: 1 }}>Apple</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </AuthLayout>
  );
};

export default Auth;
