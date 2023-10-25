import { loginWithEmailPassword } from "@/helepers/auth";
import { checkingCredentials, login, logout } from "./authSlice";
import { Dispatch } from "redux";

export const checkingAuthentication = (email, password) => {
  return async (dispatch: Dispatch) => {
    dispatch(checkingCredentials());
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

