import { createSlice } from "@reduxjs/toolkit";
const serviceSlice = createSlice({
  name: "service",
  initialState: {
    services: [],
  },
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
    },
  },
});

export const { setServices } = serviceSlice.actions;

export default serviceSlice.reducer;
