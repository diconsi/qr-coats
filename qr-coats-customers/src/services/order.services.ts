import { loadAbort } from "@/tools";
import axios from "axios";

export interface orderDto {
  customer: string;
  idAdmin: string;
  idClub: string;
  qr: [];
  totals: object;
}

export const getOrders = (creator: string, accesToken: string) => {
  const controller = loadAbort();
  return {
    call: axios.get(`http://3.19.76.186:3000/api/v1/order/getOrdersByCustomer/${creator}`, {
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
      signal: controller.signal,
    }),
    controller,
  };
};


export const createOrder = (accesToken: string, data: any) => {
  const controller = loadAbort();
  return {
    call: axios.post("http://3.19.76.186:3000/api/v1/order", data, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    }),
    controller,
  };
};