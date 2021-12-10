import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";

import App from "./App";
import Activate from "./screens/Activate";
import Login from "./screens/Login";
import Forget from "./screens/Forget";
import Register from "./screens/Register";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" exact element={<Register />} />;
      <Route path="/login" exact element={<Login />} />;
      <Route path="/users/password/forget" exact element={<Forget />} />;
      <Route path="/users/activation/:token" exact element={<Activate />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
