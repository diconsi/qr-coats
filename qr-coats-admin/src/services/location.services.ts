import { loadAbort } from "@/tools/tools";
import axios from "axios";

export const getLocations = (idClub: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`http://localhost:3000/api/v1/location/${idClub}`, {
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
    call: axios.post("http://localhost:3000/api/v1/location", locationData, {
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
      `http://localhost:3000/api/v1/location/delete/${id}`,
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
