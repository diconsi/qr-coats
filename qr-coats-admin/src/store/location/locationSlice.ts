import { createSlice } from "@reduxjs/toolkit";
const locationSlice = createSlice({
  name: "location",
  initialState: {
    locations: [{ _id: "" }],
    activeLocation: null,
  },
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    addLocation: (state, action) => {
      state.locations = [...state.locations, action.payload];
    },
    setActiveLocation: (state, action) => {
      state.activeLocation = action.payload;
    },
    updateLocation: (state, action) => {
      state.locations = state.locations.map((location) =>
        location._id === action.payload._id ? { ...action.payload } : location
      );
    },
    deleteLocationById: (state, action) => {
      state.locations = state.locations.filter(
        (location) => location._id !== action.payload
      );
    },
  },
});

export const {
  setLocations,
  addLocation,
  setActiveLocation,
  updateLocation,
  deleteLocationById,
} = locationSlice.actions;

export default locationSlice.reducer;
