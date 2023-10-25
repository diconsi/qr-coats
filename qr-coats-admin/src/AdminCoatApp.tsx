import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { AppRouter } from "./router";

import { AppTheme } from "./theme";
import store from "./store/store";
const persistor = persistStore(store);

function AdminCoatApp() {
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <AppTheme>
          <AppRouter />
        </AppTheme>
      </Provider>
    </PersistGate>
  );
}

export default AdminCoatApp;
