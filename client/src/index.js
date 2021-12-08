import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";

import App from "./App";
import Register from "./screens/Register";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" exact element={<Register />} />;
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
