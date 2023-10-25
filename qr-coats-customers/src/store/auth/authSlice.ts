import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "checking", // 'checking', 'not-authenticated', 'authenticated'
    access_token: null,
    uid: null,
    email: null,
    userName: null,
    isAnonymous: null,
    photoURL: null,
    errorMessage: null,
    openSidebar: false,
    id: null,
    name: null,
    lastName: null,
    nationality: null,
    phone: null,
    birthDate: null,
    nameCard: null,
    cardNumber: null,
    expireDate: null,
    cvv: null,
  },
  reducers: {
    login: (state, { payload }) => {
      state.status = "authenticated";
      state.access_token = payload.access_token;
      state.uid = payload.id;
      state.email = payload.email;
      state.userName = payload.userName;
      state.name = payload.name;
      // state.photoURL = payload.photoURL;
      // state.isAnonymous = payload.isAnonymous;
      state.errorMessage = null;
    },
    logout: (state, { payload }) => {
      state.status = "not-authenticated";
      state.access_token = null;
      state.uid = null;
      state.email = null;
      state.userName = null;
      state.errorMessage = payload?.errorMessage;
    },
    checkingCredentials: (state) => {
      state.status = "checking";
    },
    setViewSidebar: (state) => {
      state.openSidebar = !state.openSidebar;
    },
    updateProfile: (state, { payload }) => {
      state.id = payload.id;
      state.name = payload.name;
      state.birthDate = payload.birthDate;
      state.lastName = payload.lastName;
      state.nationality = payload.nationality;
      state.phone = payload.phone;
      state.photoURL = payload.photo;
      state.nameCard = payload.nameCard;
      state.cardNumber = payload.cardNumber;
      state.cvv = payload.cvv;
      state.expireDate = payload.expireDate;
    },
    setCard: (state, { payload }) => {
      state.nameCard = payload.nameCard;
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload.errorMessage;
    },
  },
});

export const {
  login,
  logout,
  checkingCredentials,
  setViewSidebar,
  updateProfile,
  setCard,
  setErrorMessage,
} = authSlice.actions;

export default authSlice.reducer;
