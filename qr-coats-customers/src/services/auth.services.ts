import { currentEnpoint } from "@/constants";
import { loadAbort } from "@/tools";
import axios from "axios";

interface UserData {
  username: string;
  password: string;
}

export const signIn = (userData: UserData) => {
  const controller = loadAbort();
  return {
    call: axios.post(`${currentEnpoint}api/v1/auth/signin`, userData, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const signInGoogle = (token: string) => {
  const controller = loadAbort();
  return {
    call: axios.post(
      `${currentEnpoint}api/v1/auth/google`,
      { accessToken: token },
      {
        signal: controller.signal,
      }
    ),
    controller,
  };
};

export const signUp = (userData: UserData) => {
  const controller = loadAbort();
  return {
    call: axios.post(`${currentEnpoint}api/v1/auth/signup`, userData, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const updateUser = (id: string, user: any, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.put(`${currentEnpoint}api/v1/user/${id}`, user, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};
