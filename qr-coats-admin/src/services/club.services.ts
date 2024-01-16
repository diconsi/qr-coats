import { currentEnpoint } from "@/constants";
import { loadAbort } from "@/tools/tools";
import axios from "axios";
export interface mailDTO {
  email: string;
  urlImage: string;
}

export const getClubesByAdmin = (idAdmin: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${currentEnpoint}clube/getClubesByAdmin/${idAdmin}`, {
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
    call: axios.put(`${currentEnpoint}clube/${id}`, clubeData, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

export const addCustomField = (
  id: string,
  customField: { id: string; name: string },
  accesToken: string
) => {
  const controller = loadAbort();
  return {
    call: axios.put(
      `${currentEnpoint}clube/addCustomField/${id}`,
      customField,
      {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    ),
    controller,
  };
};

export const deleteCustomField = (
  id: string,
  customField: { id: string },
  accesToken: string
) => {
  const controller = loadAbort();
  return {
    call: axios.put(
      `${currentEnpoint}clube/deleteCustomField/${id}`,
      customField,
      {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    ),
    controller,
  };
};
