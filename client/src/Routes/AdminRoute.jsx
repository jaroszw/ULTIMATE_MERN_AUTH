import { isAuth } from '../helpers/auth';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const auth = isAuth() && isAuth().role === 'admin';
  return auth ? <Outlet /> : <Navigate to="/login" replace={true} />;
}

export default AdminRoute;
