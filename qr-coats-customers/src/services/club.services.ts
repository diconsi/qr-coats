import { currentEnpoint } from "@/constants";
import { loadAbort } from "@/tools";
import axios from "axios";
export interface mailDTO {
  email: string;
  urlImage: string;
}

export const getClubes = (accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${currentEnpoint}api/v1/clube`, {
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
      signal: controller.signal,
    }),
    controller,
  };
};

export const getKey = () => {
  const controller = loadAbort();
  return {
    call: axios.get(`${currentEnpoint}api/v1/stripe`, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const createPaymentIntent = (payment: any) => {
  const controller = loadAbort();
  return {
    call: axios.post(`${currentEnpoint}api/v1/stripe`, payment, {
      signal: controller.signal,
    }),
    controller,
  };
};

export const sendCustomEmail = (emailDTO: mailDTO, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.post(
      `${currentEnpoint}api/v1/clube/sendCustomEmail`,
      emailDTO,
      {
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
        signal: controller.signal,
      }
    ),
    controller,
  };
};
