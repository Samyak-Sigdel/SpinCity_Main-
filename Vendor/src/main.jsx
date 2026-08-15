import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import VendorContextProvider from "./Context/VendorContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <VendorContextProvider>
        <App />
      </VendorContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);