import { loadAbort } from "@/tools/tools";
import axios from "axios";
export interface mailDTO {
  email: string;
  urlImage: string;
}

export const getClubesByAdmin = (idAdmin: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`http://localhost:3000/api/v1/clube/getClubesByAdmin/${idAdmin}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

export const updateClube = (id: string, clubeData: any, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.put(`http://localhost:3000/api/v1/clube/${id}`, clubeData, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};
