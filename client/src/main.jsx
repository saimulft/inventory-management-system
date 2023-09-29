import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { router } from "./Routes/router.jsx";
import { RouterProvider } from "react-router-dom";
import { GlobalProvider } from "./Providers/GlobalProviders.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </GlobalProvider>
  </React.StrictMode>
);
