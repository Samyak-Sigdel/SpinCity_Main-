import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import CustomerContextProvider from "./Context/CustomerContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomerContextProvider>
        <App />
      </CustomerContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);