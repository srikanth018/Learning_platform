import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "regenerator-runtime/runtime";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
