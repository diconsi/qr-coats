import { createSlice } from "@reduxjs/toolkit";
interface AuthState {
  status: "checking" | "not-authenticated" | "authenticated";
  access_token: string;
  uid: string;
  email: string;
  userName: string;
  isAnonymous: boolean | null;
  photoURL: string;
  errorMessage: string;
  openSidebar: boolean;
  id: string;
  name: string;
  lastName: string;
  nationality: string;
  phone: string;
  birthDate: string;
  idClub: string;
}
const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "not-authenticated", // 'checking', 'not-authenticated', 'authenticated'
    access_token: "",
    uid: "",
    email: "",
    userName: "",
    isAnonymous: null,
    photoURL: "",
    errorMessage: "",
    openSidebar: false,
    id: "",
    name: "",
    lastName: "",
    nationality: "",
    phone: "",
    birthDate: "",
    idClub: "",
  } as AuthState,
  reducers: {
    login: (state, { payload }) => {
      state.status = "authenticated";
      state.access_token = payload.access_token;
      state.uid = payload.id;
      state.email = payload.email;
      state.userName = payload.userName;
      state.name = payload.name;
      state.photoURL = payload.photoURL;
      state.phone = payload.phone;
      state.birthDate = payload.birthDate;
      state.nationality = payload.nationality;
      state.isAnonymous = payload.isAnonymous;
      state.errorMessage = "";
    },
    logout: (state, { payload }) => {
      state.status = "not-authenticated";
      state.access_token = "";
      state.uid = "";
      state.email = "";
      state.userName = "";
      state.errorMessage = payload?.errorMessage;
    },
    checkingCredentials: (state) => {
      state.status = "checking";
    },
    setViewSidebar: (state) => {
      state.openSidebar = !state.openSidebar;
    },
    updateProfile: (state, { payload }) => {
      state.name = payload.name;
      state.email = payload.email;
      state.birthDate = payload.birthDate;
      state.nationality = payload.nationality;
      state.phone = payload.phone;
      state.photoURL = payload.photoURL;
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload.errorMessage;
    },
    setIdClub: (state, { payload }) => {
      state.idClub = payload;
    },
  },
});

export const {
  login,
  logout,
  checkingCredentials,
  setViewSidebar,
  updateProfile,
  setErrorMessage,
  setIdClub
} = authSlice.actions;

export default authSlice.reducer;
