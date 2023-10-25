import {
  createCard,
  createProfile,
  loginAnonymously,
  loginWithEmailPassword,
  logoutFirebase,
  registerUserWithEmailPassword,
  singInWhitGoogle,
  updateProfileUser,
} from "@/firebase/providers";
import {
  checkingCredentials,
  login,
  logout,
  setCard,
  updateProfile,
} from "./authSlice";
import { Dispatch } from "redux";

export const checkingAuthentication = (email, password) => {
  return async (dispatch: Dispatch) => {
    dispatch(checkingCredentials());
  };
};

export const startGoogleSignIn = () => {
  return async (dispatch: Dispatch) => {
    dispatch(checkingCredentials());

    const result = await singInWhitGoogle();
    if (!result.ok) return dispatch(logout(result.errorMessage));
    dispatch(login(result));
    dispatch(createProfileUser(result));
  };
};

export const startCreatingUserWithEmailPassword = ({
  email,
  password,
  displayName,
}) => {
  return async (dispatch: Dispatch) => {
    dispatch(checkingCredentials());

    const { ok, uid, photoURL, errorMessage } =
      await registerUserWithEmailPassword({
        email,
        password,
        displayName,
      });
    if (!ok) return dispatch(logout({ errorMessage }));
    dispatch(login({ uid, displayName, email, photoURL }));
  };
};

export const startLoginWithEmailPassword = ({ email, password }) => {
  return async (dispatch: Dispatch) => {
    dispatch(checkingCredentials());
    const result = await loginWithEmailPassword({ email, password });
    if (!result.ok) return dispatch(logout(result));
    dispatch(login(result));
  };
};

export const startLoginAnonymously = () => {
  return async (dispatch) => {
    const result = await loginAnonymously();
    if (!result.ok) return dispatch(logout(result));
    dispatch(login(result));
  };
};


export const startUpdateProfile = (profile: object) => {
  return async (dispatch: Dispatch) => {
    await updateProfileUser(profile);
  };
};

export const createProfileUser = (profile: object) => {
  return async (dispatch: Dispatch) => {
    const resp = await createProfile(profile);
    dispatch(updateProfile(resp));
  };
};

export const startNewCard = (card: object) => {
  return async (dispatch: Dispatch, getState: any) => {
    const { id } = getState().authState;
    await createCard(card, id);
    dispatch(setCard(card));
  };
};

export const startLogout = () => {
  return async (dispatch: Dispatch) => {
    await logoutFirebase();
    dispatch(logout());
  };
};