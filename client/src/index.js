import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import App from './App';
import Activate from './screens/Activate';
import Login from './screens/Login';
import Forget from './screens/Forget';
import Register from './screens/Register';
import Private from './screens/Private';
import Admin from './screens/Admin';
import ResetPassword from './screens/ResetPassword';
import PrivateRoute from './Routes/PrivateRoute';
import AdminRoute from './Routes/AdminRoute';

ReactDOM.render(
  <BrowserRouter>
    <div
      style={{
        width: '400px',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 auto',
        alignItems: 'center',
        fontWeight: 'bold',
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </div>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users/password/forget" exact element={<Forget />} />;
      <Route
        path="/users/password/reset/:token"
        exact
        element={<ResetPassword />}
      />
      ;
      <Route path="/users/activation/:token" exact element={<Activate />} />
      <Route path="/private" element={<PrivateRoute />}>
        <Route element={<Private />} />
      </Route>
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<Admin />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
