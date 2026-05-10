import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./assets/UserContext"; // âœ… Make sure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css'
import './style/tailwind.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
       
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
