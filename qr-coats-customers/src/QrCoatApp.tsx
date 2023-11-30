import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { AppRouter } from "./router";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./store/store";
import { AppTheme } from "./theme";
const persistor = persistStore(store);
function QrCoatApp() {
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

export default QrCoatApp;
