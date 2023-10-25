import { loadAbort } from "@/tools";
import axios from "axios";

export interface orderDto {
  customer: string;
  idAdmin: string;
  idClub: string;
  qr: [];
  totals: object;
}

export const ordersByIdCustomer = (idCustomer: string) => {
  const controller = loadAbort();
  return {
    call: axios.get("http://localhost:3000/orders/ordersByIdCustomer", {
      params: {
        idCustomer,
      },
      signal: controller.signal,
    }),
    controller,
  };
};

export const getOrderById = (
  idAdmin: string,
  idClub: string,
  idOrder: string
) => {
  const controller = loadAbort();
  return {
    call: axios.get("http://localhost:3000/orders/getOrderById", {
      params: {
        idAdmin,
        idClub,
        idOrder,
      },
      signal: controller.signal,
    }),
    controller,
  };
};

export const createNewOrder = (order: orderDto) => {
  const controller = loadAbort();
  return {
    call: axios.post("http://localhost:3000/orders", order, {
      signal: controller.signal,
    }),
    controller,
  };
};
