import { currentEnpoint } from "@/constants";
import { loadAbort } from "@/tools/tools";
import axios from "axios";

export const getClubesByUser = (idAdmin: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${currentEnpoint}api/v1/user/${idAdmin}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

export const createEmployee = (accesToken: string, userData: any) => {
  const controller = loadAbort();
  return {
    call: axios.post(`${currentEnpoint}api/v1/auth/signup`, userData, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

export const updateUser = (id: string, user: any, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.put(`${currentEnpoint}api/v1/user/${id}`, user, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

export const deleteUser = (id: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.put(`${currentEnpoint}api/v1/user/delete/${id}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

export const getEmployeesByAdmin = (idAdmin: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(
      `${currentEnpoint}api/v1/user/getEmployessByAdmin/${idAdmin}`,
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
