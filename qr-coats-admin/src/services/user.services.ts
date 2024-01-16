import { currentEnpoint } from "@/constants";
import { loadAbort } from "@/tools/tools";
import axios from "axios";

export const getClubesByUser = (idAdmin: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`${currentEnpoint}user/${idAdmin}`, {
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
    call: axios.post(`${currentEnpoint}auth/signup`, userData, {
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
    call: axios.put(`${currentEnpoint}user/${id}`, user, {
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
    call: axios.put(`${currentEnpoint}user/delete/${id}`, {
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
    call: axios.get(`${currentEnpoint}user/getEmployessByAdmin/${idAdmin}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};



export const updatePassword = (id: string, user: any, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.put(`${currentEnpoint}user/updatePassword/${id}`, user, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};

