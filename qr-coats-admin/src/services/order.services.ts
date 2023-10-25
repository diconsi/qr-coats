import { loadAbort } from "@/tools/tools";
import axios from "axios";

export const getOrder = (accesToken: string) => {
  console.log("api",accesToken)
  const controller = loadAbort();
  return {
    call: axios.get(`http://localhost:3000/api/v1/order`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};
