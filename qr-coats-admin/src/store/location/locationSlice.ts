import { createSlice } from "@reduxjs/toolkit";
const locationSlice = createSlice({
  name: "location",
  initialState: {
    locations: [],
    activeLocation: null,
  },
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    addLocation: (state, action) => {
      state.locations.push(action.payload);
    },
    setActiveLocation: (state, action) => {
      state.activeLocation = action.payload;
    },
    updateLocation: (state, action) => {
      state.locations = state.locations.map((location) =>
        location.id === action.payload.id ? { ...action.payload } : location
      );
    },
    deleteLocationById: (state, action) => {
      state.locations = state.locations.filter(
        (location) => location.id !== action.payload
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
