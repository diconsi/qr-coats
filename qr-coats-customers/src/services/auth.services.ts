import { loadAbort } from "@/tools";
import axios from "axios";

interface UserData {
  username: string;
  password: string;
}

export const signIn = (userData: UserData) => {
  const controller = loadAbort();
  return {
    call: axios.post("http://localhost:3000/api/v1/auth/signin", userData, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const signInGoogle = (token: string) => {
  const controller = loadAbort();
  return {
    call: axios.post(
      "http://localhost:3000/api/v1/auth/google",
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
    call: axios.post("http://localhost:3000/api/v1/auth/signup", userData, {
      signal: controller.signal,
    }),
    controller,
  };
};
