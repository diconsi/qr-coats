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
    call: axios.post(`${currentEnpoint}auth/signin`, userData, {
      signal: controller.signal,
    }),
    controller,
  };
};
