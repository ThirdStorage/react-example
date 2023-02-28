import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { AuthWrapper } from "@thirdstorage/sdk";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthWrapper
    appName="Third Storage TEST"
    walletConnectProjectId={"36d14281c36a7e71ecb67f36d1a4a2b6"}
    arcanaAppId="90677acac473651d0626e04371d59c96b4af83fb"
  >
    <App />
  </AuthWrapper>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
