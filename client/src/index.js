import React from "react";
import { createRoot } from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";
import "./index.css"; // if you use Tailwind or normal css
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const root = createRoot(document.getElementById("root"));
root.render(<App />);