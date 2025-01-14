import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import App from "./App";
import "./index.css";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_EzjFEAwIm",
  client_id: "1tsvk54e4kl3ffh9lmr54mlhqk",
  redirect_uri: "https://main.d13201o4m2xh44.amplifyapp.com/",
  response_type: "code",
  scope: "email openid profile",
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
