import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import QrCoatApp from "./QrCoatApp.tsx";
import "./styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={
        "169386123935-i87bl3t7e9tjkc7hf2oo57ge3u3ds25d.apps.googleusercontent.com"
      }
    >
      <BrowserRouter>
        <QrCoatApp />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
