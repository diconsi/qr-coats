import { createSlice } from "@reduxjs/toolkit";
const clubSlice = createSlice({
  name: "club",
  initialState: {
    clubes: [],
    activeClub: null,
    serviceOrder: [],
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
    resetServicesOrder: (state) => {
      state.serviceOrder = [];
    },
    deleteServiceById: (state, action) => {
      state.serviceOrder = state.serviceOrder.filter(
        (service) => service.id !== action.payload
      );
    },
  },
});

export const { setClubes, setActiveClub, addService, resetServicesOrder, deleteServiceById } =
  clubSlice.actions;

export default clubSlice.reducer;
