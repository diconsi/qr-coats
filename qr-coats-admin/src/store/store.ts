import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import authSlice from "./auth/authSlice";
import clubSlice from "./club/clubSlice";
import employeeSlice from "./employee/employeeSlice";
import locationSlice from "./location/locationSlice";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authState", "clubState", "employeeState", "locationState"],
};

const rootReducer = combineReducers({
  authState: authSlice,
  clubState: clubSlice,
  employeeState: employeeSlice,
  locationState: locationSlice,
});

const persisteReducer = persistReducer(persistConfig, rootReducer);

export const store= configureStore({
  reducer: persisteReducer,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;