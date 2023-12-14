import { currentEnpoint } from "@/constants";
import { loadAbort } from "@/tools/tools";
import axios from "axios";

export const getLocations = (idClub: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${currentEnpoint}api/v1/location/${idClub}`, {
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
    call: axios.post(`${currentEnpoint}api/v1/location`, locationData, {
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
  update: any,
  accesToken: string
) => {
  const controller = loadAbort();
  return {
    call: axios.put(
      `${currentEnpoint}api/v1/location/delete/${id}`,
      update,
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
