import { createSlice } from "@reduxjs/toolkit";
const clubSlice = createSlice({
  name: "club",
  initialState: {
    clubes: [],
    activeClub: {
      _id: "",
      name: "",
      photo: "",
      withGateway: false,
      withGatewayPayment: false,
      withCash: false,
      customNote: "",
      breakNumber: 0,
      breakTime: 0,
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
      closingHour: "",
      openingHour: "",
      slotsActive: false,
      numberLocations: 0,
    },
    serviceOrder: [],
  },
  reducers: {
    setClubes: (state, action) => {
      state.clubes = action.payload;
    },
    setActiveClub: (state, action) => {
      state.activeClub = action.payload;
    },
  },
});

export const { setClubes, setActiveClub } = clubSlice.actions;

export default clubSlice.reducer;
