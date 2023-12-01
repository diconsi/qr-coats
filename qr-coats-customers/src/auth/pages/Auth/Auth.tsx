import { AuthLayout } from "@/auth/layout";
import { CustomButton } from "@/clube/components";
import { loginPath, resgiterPath } from "@/constants";
import { useAppDispatch, useFetchAndLoad, useRedirectTo } from "@/hooks";
import { signIn, signInGoogle, signUp } from "@/services";
import { login, setErrorMessage } from "@/store/auth/authSlice";
import { Button, Grid, Typography } from "@mui/material";
import { GoogleCredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface IUserData {
  username: string;
  rol: string;
}

const Auth = () => {
  const redirectTo = useRedirectTo();
  const dispatch = useAppDispatch();
  const { callEndpoint } = useFetchAndLoad();

  const onLogin = () => {
    redirectTo(loginPath);
  };

  const onLoginAnonymously = async () => {
    const user = uuidv4();
    const newUser = {
      name: user,
      username: user,
      password: user,
      rol: "customer",
      email: `${user}@example.com`,
      isAnonymous: true,
    };
    const { data } = (await callEndpoint(signUp(newUser))) as {
      data: IUserData;
    };
    const { username } = data;
    try {
      const { data } = (await callEndpoint(
        signIn({ username: username, password: user })
      )) as { data: IUserData };
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

  const onSuccess = async (response: GoogleCredentialResponse) => {
    const { credential } = response;
    if (credential === undefined) return;
    const { data } = (await callEndpoint(signInGoogle(credential))) as {
      data: IUserData;
    };
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
      <Grid
        container
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={12}>
          <CustomButton
            className="auth-button"
            onClick={onLoginAnonymously}
            label={"START"}
            fullWidth={true}
            background="linear-gradient(to bottom, #A482F2, #8CABF0)"
            style={{ border: "none" }}
          />
        </Grid>
        <Grid item xs={12} mt={2}>
          <CustomButton
            className="auth-button"
            onClick={onLogin}
            label={"I HAVE AN ACCOUNT"}
            fullWidth={true}
          />
        </Grid>
        <Grid item xs={12} mt={2}>
          <span
            style={{
              fontWeight: "normal",
              fontSize: "14px",
              marginRight: "5px",
            }}
          >
            DON´T HAVE AN ACCOUNT?
          </span>
          <Link
            style={{ color: "white", textDecoration: "none" }}
            to={resgiterPath}
          >
            CREATE ONE
          </Link>
        </Grid>
        <Grid item xs={12} mt={2}>
          <Typography variant="h6" align="center">
            SIGN IN WITH
          </Typography>
        </Grid>
        <Grid item xs={12} >
          <Grid container>
            <Grid
              item
              xs={12}
              md={6}
              display={"flex"}
              justifyContent={"center"}
              mt={2}
            >
              <GoogleLogin
                size="large"
                onSuccess={onSuccess}
                onError={onError}
              />
            </Grid>
            <Grid item mt={2} xs={12} md={6}>
              <Button variant="contained" fullWidth>
                <Typography sx={{ ml: 1 }}>Apple</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthLayout>
  );
};

export default Auth;
