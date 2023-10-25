import { AppRouter } from "./router";
import { store } from "./store";
import { AppTheme } from "./theme";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

function QrCoatApp() {
  return (
    <Provider store={store}>
      <AppTheme>
        <AppRouter />
      </AppTheme>
    </Provider>
  );
}

export default QrCoatApp;
