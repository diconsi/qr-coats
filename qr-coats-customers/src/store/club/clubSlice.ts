import { createSlice } from "@reduxjs/toolkit";
const clubSlice = createSlice({
  name: "club",
  initialState: {
    clubes: [],
    receiptHistory: [],
    activeClub: null,
    activeReceipt: null,
    serviceOrder: [],
    order: [],
    totals: {},
  },
  reducers: {
    setClubes: (state, action) => {
      state.clubes = action.payload;
    },
    setActiveClub: (state, action) => {
      state.activeClub = action.payload;
    },
    addService: (state, action) => {
      state.serviceOrder.push(action.payload);
    },
    addTotals: (state, action) => {
      state.totals = action.payload;
    },
    resetServicesOrder: (state) => {
      state.serviceOrder = [];
    },
    deleteServiceById: (state, action) => {
      state.serviceOrder = state.serviceOrder.filter(
        (service) => service.id !== action.payload
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
} = clubSlice.actions;

export default clubSlice.reducer;
