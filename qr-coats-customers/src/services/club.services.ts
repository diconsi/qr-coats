import { loadAbort } from "@/tools";
import axios from "axios";
export interface mailDTO {
  email: string;
  urlImage: string;
}

export const getClubes = (accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get("http://localhost:3000/clube", {
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
      signal: controller.signal,
    }),
    controller,
  };
};

export const getClubById = (idClub: string, idAdmin: string) => {
  const controller = loadAbort();
  return {
    call: axios.get("http://localhost:3000/clubes/get-club", {
      params: {
        idClub: idClub,
        idAdmin: idAdmin,
      },
      signal: controller.signal,
    }),
    controller,
  };
};

export const sendCustomEmail = (emailDTO: mailDTO) => {
  const controller = loadAbort();
  return {
    call: axios.post("http://localhost:3000/clubes/sendCustomEmail", emailDTO, {
      signal: controller.signal,
    }),
    controller,
  };
};
