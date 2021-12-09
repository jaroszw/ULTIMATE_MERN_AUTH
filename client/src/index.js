import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";

import App from "./App";
import Activate from "./screens/Activate";
import Register from "./screens/Register";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" exact element={<Register />} />;
      <Route path="/user/activation/:token" exact element={<Activate />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
