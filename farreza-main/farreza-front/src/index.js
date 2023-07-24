import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./assets/css/fonts.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import App from "./App";
import axios from "axios";
import Cookies from "js-cookie";

axios.interceptors.request.use(
  config => {
    const token = Cookies.get("tokenUser") || null
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  error => {
    console.error("axios.interceptors.request error");
    Promise.reject(error)
  });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
