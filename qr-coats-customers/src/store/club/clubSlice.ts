import { IService } from "@/clube/pages/ClubManagment/pages/Services/components/TotalsSection";
import { createSlice } from "@reduxjs/toolkit";

const clubSlice = createSlice({
  name: "club",
  initialState: {
    clubes: [],
    receiptHistory: [],
    activeClub: {
      _id: "",
      name: "",
      photo: "",
      withGateway: false,
      customNote: "",
      icon: "",
      iconQrVisible: false,
      services: [{ enable: false, id: "", name: "", price: 0, status: false }],
      informationGuest: {
        email: false,
        lastName: false,
        name: false,
        phone: false,
      },
      withInformationGuest: false,
      customFields: [{ id: "", name: "" }],
    },
    activeReceipt: {
      _id: "",
      date: "",
      clubId: "",
      totals: {
        qst: "",
        subtotal: "",
        tip: "",
        total: "",
        products: [{ title: "", value: 0 }],
      },
    },
    qrList: [
      {
        name: "",
        email: "",
        img: null,
        services: {
          id: "",
          name: "",
        },
      },
    ],
    order: [],
    totals: {
      total: 0,
      subtotal: 0,
    },
    services: [
      {
        enable: true,
        id: "",
        name: "",
        price: 0,
        status: false,
        total: 0,
      },
    ],
    promotion: {
      name: "",
      price: 0,
      status: false,
    },
  },
  reducers: {
    setClubes: (state, action) => {
      state.clubes = action.payload;
    },
    setActiveClub: (state, action) => {
      state.activeClub = { ...state.activeClub, ...action.payload };
    },
    addService: (state, action) => {
      state.qrList = [...state.qrList, action.payload];
    },
    addTotals: (state, action) => {
      state.totals = action.payload;
    },
    resetServicesOrder: (state) => {
      state.qrList = [];
    },
    deleteServiceById: (state, action) => {
      state.qrList = state.qrList.filter(
        (service) => service.email !== action.payload
      );
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setReceiptHistory: (state, action) => {
      state.receiptHistory = action.payload;
    },
    setActiveReceipt: (state, action) => {
      state.activeReceipt = action.payload;
    },

    setServices: (state, action) => {
      state.services = action.payload.services;
      state.promotion = action.payload.promotion;
    },
    updateServices: (state, action) => {
      const { id, amount } = action.payload;
      const updatedServices = state.services.map((service: IService) => {
        if (service.id === id) {
          if (amount === -1 && service.total === 0) {
            return service;
          }
          return { ...service, total: service.total + amount };
        }
        return service;
      });
      state.services = updatedServices;
    },
  },
});

export const {
  setClubes,
  setActiveClub,
  addService,
  setOrder,
  resetServicesOrder,
  deleteServiceById,
  addTotals,
  setReceiptHistory,
  setActiveReceipt,
  setServices,
  updateServices,
} = clubSlice.actions;

export default clubSlice.reducer;
