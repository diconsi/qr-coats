
export interface product {
  desc: string;
  price: number;
  qty: number;
  unit: number;
}

export interface service {
  id: string;
  name: string;
}

export interface qr {
  id: string;
  email: string;
  img: string;
  name: string;
  services: [service];
}

export interface order {
  orderId: string;
  customer: string;
  date: string;
  products: [product];
  qr: [qr];
  qst: string;
  subtotal: string;
  tip: string;
  total: string;
}

export interface Order {
  id: string;
  name: string;
  date: string;
  idAdmin: string;
  idClub: string;
  idCustomer: string;
  idOrder: string;
  total: string;
}


