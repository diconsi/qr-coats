export interface field {
  id: string;
  name: string;
}

export interface service {
  enable: boolean;
  id: string;
  name: string;
  price: number;
  status: boolean;
}

export interface IClub {
  _id: string;
  name: string;
  icon: string;
  breakNumber: number;
  breakTime: number;
  closingHour: string;
  customFields: [field];
  customNote: string;
  iconQrVisible: boolean;
  informationGuest: {
    email: boolean;
    lastName: boolean;
    name: boolean;
    phone: boolean;
  };
  numberLocations: number;
  openingHour: string;
  photo: string;
  services: [service];
  slotsActive: boolean;
  withInformationGuest: boolean;
  withCash: boolean;
  withGateway: boolean;
  withGatewayPayment: boolean;
}
