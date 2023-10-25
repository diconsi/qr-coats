import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import clubSlice from "./club/clubSlice";

export const store = configureStore({
  reducer: {
    authState: authSlice,
    clubState: clubSlice,
  },
});
