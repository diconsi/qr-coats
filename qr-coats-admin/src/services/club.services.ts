import { loadAbort } from "@/tools/tools";
import axios from "axios";
import { useSelector } from "react-redux";
export interface mailDTO {
  email: string;
  urlImage: string;
}

export const getClubes = () => {
  const controller = loadAbort();
  return {
    call: axios.get("http://localhost:3000/api/v1/user/clube", {
      signal: controller.signal,
    }),
    controller,
  };
};

export const updateClube = (id: string, clubeData: any, accesToken: string) => {
  console.log(clubeData)
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
