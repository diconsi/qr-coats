import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "not-authenticated", // 'checking', 'not-authenticated', 'authenticated'
    uid: null,
    email: null,
    userName: null,
    name: null,
    access_token: null,
    photoURL: null,
    errorMessage: null,
    openSidebar: false,
  },
  reducers: {
    login: (state, { payload }) => {
      state.status = "authenticated";
      state.access_token = payload.access_token;
      state.uid = payload.id;
      state.email = payload.email;
      state.userName = payload.userName;
      state.name = payload.name;
    },
    logout: (state, { payload }) => {
      state.status = "not-authenticated";
      state.uid = null;
      state.email = null;
      state.errorMessage = payload?.errorMessage;
    },
    checkingCredentials: (state) => {
      state.status = "checking";
    },
    setViewSidebar: (state) => {
      state.openSidebar = !state.openSidebar;
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
  setErrorMessage,
} = authSlice.actions;

export default authSlice.reducer;
