import { currentEnpoint } from "@/constants";
import { loadAbort } from "@/tools/tools";
import axios from "axios";

export const getLocations = (idClub: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${currentEnpoint}location/byClub/${idClub}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

export const createLocation = (accesToken: string, locationData: any) => {
  const controller = loadAbort();
  return {
    call: axios.post(`${currentEnpoint}location`, locationData, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

export const updatedLocation = (
  id: string,
  locationData: any,
  accesToken: string
) => {
  const controller = loadAbort();
  return {
    call: axios.put(`${currentEnpoint}location/${id}`, locationData, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

export const eliminaLocation = (
  id: string,
  accesToken: string,
  body: object
) => {
  const controller = loadAbort();
  return {
    call: axios.put(`${currentEnpoint}location/delete/${id}`, body, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};
