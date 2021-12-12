import { isAuth } from '../helpers/auth';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const auth = isAuth();
  console.log(auth);
  return auth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
